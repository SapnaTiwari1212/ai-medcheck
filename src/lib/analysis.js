import { TESTS } from '../data/knowledge.js'

function cleanLine(line) {
  return line.replace(/[\t\r|]+/g, ' ').replace(/[ ]{2,}/g, ' ').trim()
}

function toNumber(raw) {
  const n = parseFloat(raw.replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

function findNumbers(text) {
  const out = []
  const re = /\d[\d.,]*/g
  let m
  while ((m = re.exec(text)) !== null) {
    const num = toNumber(m[0])
    if (num !== null) {
      out.push({ raw: m[0], num, start: m.index, end: m.index + m[0].length })
    }
  }
  return out
}

function isDashLetterAfter(text, start) {
  const after = text.slice(start, start + 6)
  return /^[-–—]\s*[a-zA-Z%]/.test(after)
}

function findRange(text) {
  const re = /(\d[\d.,]*)\s*[-–—]\s*(\d[\d.,]*)/g
  const m = re.exec(text)
  if (m) {
    return {
      min: toNumber(m[1]),
      max: toNumber(m[2]),
      start: m.index,
      end: m.index + m[0].length,
    }
  }
  return null
}

function findBound(text) {
  const re = /(?:<|≤|<=|>|≥|>=|less than|greater than|less or equal|greater or equal)\s*(\d[\d.,]*)/i
  const m = re.exec(text)
  if (m) {
    return {
      value: toNumber(m[1]),
      symbol: m[1] ? m[0].match(/[<>≤≥]/)?.[0] || (m[0].match(/less/i) ? '<' : '>') : null,
      start: m.index,
      end: m.index + m[0].length,
    }
  }
  return null
}

function matchAlias(line, entry) {
  let best = null
  for (const alias of entry.aliases) {
    const m = alias.exec(line)
    if (m && (best === null || m.index < best.start || (m.index === best.start && m[0].length > best.length))) {
      best = { start: m.index, end: m.index + m[0].length, text: m[0] }
    }
  }
  return best
}

function findUnit(line, entry) {
  if (entry.unitHint) {
    const m = entry.unitHint.exec(line)
    if (m) return m[0]
  }
  const generic = /\b(?:g\/?dL|mg\/?dL|ug\/?L|ng\/?mL|pg\/?mL|mmol\/?L|mEq\/?L|u\/?L|IU\/?L|fL|%|mm\/?hr|mIU\/?L|mL\/?min|U\/?L)\b/i
  const m = generic.exec(line)
  return m ? m[0] : null
}

function parseLine(line, entry) {
  const alias = matchAlias(line, entry)
  if (!alias) return null

  const range = findRange(line)
  const bound = range ? null : findBound(line)

  const skip = new Set()
  if (range) {
    for (const n of findNumbers(line.slice(range.start, range.end))) {
      skip.add(range.start + n.start)
    }
  }

  const nums = findNumbers(line).filter((n) => {
    if (n.start < alias.end) return false
    if (skip.has(n.start)) return false
    if (isDashLetterAfter(line, n.end)) return false
    return true
  })

  let valueNum = nums.length > 0 ? nums[0].num : null
  let valueRaw = nums.length > 0 ? nums[0].raw : null
  const valueIsBound =
    bound &&
    nums.length === 1 &&
    nums[0].start >= bound.start &&
    nums[0].start < bound.end

  let status = 'unknown'
  let direction = null
  if (valueNum !== null && range) {
    if (valueNum > range.max) {
      status = 'high'
      direction = 'high'
    } else if (valueNum < range.min) {
      status = 'low'
      direction = 'low'
    } else {
      status = 'normal'
    }
  } else if (bound) {
    const sym = bound.symbol || ''
    if (valueIsBound) {
      valueRaw = `${sym} ${bound.value}`
      valueNum = bound.value
      status = 'normal'
    } else if (valueNum !== null) {
      if (sym.includes('>')) {
        status = valueNum < bound.value ? 'low' : 'normal'
        direction = status === 'low' ? 'low' : null
      } else {
        status = valueNum > bound.value ? 'high' : 'normal'
        direction = status === 'high' ? 'high' : null
      }
    }
  }

  const unit = findUnit(line, entry)

  return {
    name: entry.name,
    id: entry.id,
    category: entry.category,
    explanation: entry.explanation,
    rangeLabel: entry.rangeLabel,
    rangeMin: range?.min ?? null,
    rangeMax: range?.max ?? null,
    valueNum,
    valueRaw,
    displayValue: valueRaw ?? '—',
    unit: unit || null,
    status,
    direction,
    abnormal: entry.abnormal,
    matchedLine: line,
  }
}

function normalize(item, idx) {
  return {
    ...item,
    key: `${item.id}-${idx}`,
    insight: item.abnormal?.[item.direction]?.insight ?? null,
    symptoms: item.direction ? item.abnormal[item.direction].symptoms : [],
    prevention: item.direction ? item.abnormal[item.direction].prevention : [],
    consult: item.direction ? item.abnormal[item.direction].consult : null,
  }
}

function dedupe(list) {
  const seen = new Set()
  return list.filter((x) => {
    const k = String(x).trim().toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

export function analyzeReport(text) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map(cleanLine)
    .filter(Boolean)

  const items = []
  const otherValues = []

  for (const line of lines) {
    let matched = null
    let best = null
    for (const entry of TESTS) {
      const a = matchAlias(line, entry)
      if (a && (best === null || a.start < best.start || (a.start === best.start && a.text.length > best.text.length))) {
        best = a
        matched = entry
      }
    }

    if (!matched) {
      if (/\d/.test(line) && !/[:@]/.test(line) && !/^[A-Z][A-Z0-9 /&().-]{3,}$/.test(line) && otherValues.length < 8) {
        const n = findNumbers(line).find((x) => !isDashLetterAfter(line, x.end))
        if (n) otherValues.push({ raw: line, valueRaw: n.raw, num: n.num })
      }
      continue
    }

    const parsed = parseLine(line, matched)
    if (parsed && parsed.valueNum !== null) items.push(parsed)
  }

  const mapped = items.map(normalize)

  const summary = {
    total: mapped.length,
    normal: mapped.filter((i) => i.status === 'normal').length,
    high: mapped.filter((i) => i.status === 'high').length,
    low: mapped.filter((i) => i.status === 'low').length,
    abnormal: mapped.filter((i) => i.status === 'high' || i.status === 'low').length,
    categories: [...new Set(mapped.map((i) => i.category))],
  }

  const abnormalItems = mapped.filter((i) => i.direction)

  return {
    matched: mapped.length > 0,
    items: mapped,
    otherValues,
    rawText: text,
    summary,
    insights: abnormalItems.map((i) => ({ id: i.id, test: i.name, insight: i.insight })).filter((i) => i.insight),
    symptoms: dedupe(abnormalItems.flatMap((i) => i.symptoms)),
    prevention: dedupe(abnormalItems.flatMap((i) => i.prevention)),
    consult: abnormalItems
      .map((i) => ({ test: i.name, advice: i.consult }))
      .filter((i) => i.advice),
    note: null,
  }
}
