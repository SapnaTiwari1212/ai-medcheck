export function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function buildSummaryText(result, fileName) {
  const L = []
  const stamp = new Date().toLocaleString()
  L.push('AI MedCheck — Report Analysis Summary')
  L.push(`Generated: ${stamp}`)
  L.push(`Source: ${fileName || 'sample report'}`)
  L.push('')
  L.push('IMPORTANT DISCLAIMER')
  L.push('This summary is educational only and is NOT a diagnosis or medical advice.')
  L.push('Always consult a qualified healthcare professional about your results.')
  L.push('')
  L.push('Summary')
  L.push(`Total tests identified: ${result.summary.total}`)
  L.push(`Within range: ${result.summary.normal}`)
  L.push(`Above range: ${result.summary.high}`)
  L.push(`Below range: ${result.summary.low}`)
  L.push('')
  L.push('Results')
  for (const item of result.items) {
    const status = item.status === 'unknown' ? 'not assessed' : item.status
    L.push(`- ${item.name}: ${item.displayValue}${item.unit ? ' ' + item.unit : ''} (${item.rangeLabel}) — ${status}`)
  }
  L.push('')
  if (result.symptoms.length) {
    L.push('Possible related symptoms to discuss with your doctor:')
    result.symptoms.forEach((s) => L.push(`  • ${s}`))
    L.push('')
  }
  if (result.prevention.length) {
    L.push('Prevention & lifestyle suggestions:')
    result.prevention.forEach((s) => L.push(`  • ${s}`))
    L.push('')
  }
  if (result.consult.length) {
    L.push('Doctor consultation guidance:')
    result.consult.forEach((c) => L.push(`  • ${c.test}: ${c.advice}`))
  }
  return L.join('\n')
}

export function uid() {
  return Math.random().toString(36).slice(2, 10)
}
