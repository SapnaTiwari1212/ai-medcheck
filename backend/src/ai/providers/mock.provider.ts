import { Injectable } from '@nestjs/common';
import { AiAnalysisResult, AiProvider, AiTestResult } from '../ai.types';
import { DISCLAIMER } from './openai.provider';
import { KNOWLEDGE_BASE, KnowledgeEntry } from '../knowledge';

function cleanLine(line: string): string {
  return line.replace(/[\t\r|]+/g, ' ').replace(/[ ]{2,}/g, ' ').trim();
}

function toNumber(raw: string): number | null {
  const n = parseFloat(raw.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

interface NumberMatch {
  num: number;
  raw: string;
  start: number;
  end: number;
}

function findNumbers(text: string): NumberMatch[] {
  const out: NumberMatch[] = [];
  const re = /\d[\d.,]*/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const num = toNumber(m[0]);
    if (num !== null) {
      out.push({ num, raw: m[0], start: m.index, end: m.index + m[0].length });
    }
  }
  return out;
}

function isDashLetterAfter(text: string, start: number): boolean {
  const after = text.slice(start, start + 6);
  return /^[-–—]\s*[a-zA-Z%]/.test(after);
}

interface ParsedRange {
  min: number;
  max: number;
  start: number;
  end: number;
}

function findRange(text: string): ParsedRange | null {
  const re = /(\d[\d.,]*)\s*[-–—]\s*(\d[\d.,]*)/g;
  const m = re.exec(text);
  if (m) {
    return { min: toNumber(m[1])!, max: toNumber(m[2])!, start: m.index, end: m.index + m[0].length };
  }
  return null;
}

function matchAlias(line: string, entry: KnowledgeEntry): { start: number; end: number; length: number } | null {
  let best: { start: number; end: number; length: number } | null = null;
  for (const alias of entry.aliases) {
    const m = alias.exec(line);
    if (m && (best === null || m.index < best.start || (m.index === best.start && m[0].length > best.length))) {
      best = { start: m.index, end: m.index + m[0].length, length: m[0].length };
    }
  }
  return best;
}

function findUnit(line: string, entry: KnowledgeEntry): string | null {
  if (entry.unitHint) {
    for (const re of entry.unitHint) {
      const m = re.exec(line);
      if (m) return m[0];
    }
  }
  return null;
}

interface ParsedLine {
  entry: KnowledgeEntry;
  valueNum: number | null;
  valueRaw: string | null;
  status: AiTestResult['status'];
  direction: 'high' | 'low' | null;
  unit: string | null;
  referenceRange: string | null;
}

function parseLine(line: string, entry: KnowledgeEntry): ParsedLine | null {
  const alias = matchAlias(line, entry);
  if (!alias) return null;

  const range = findRange(line);

  const nums = findNumbers(line).filter((n) => {
    if (n.start < alias.end) return false;
    if (isDashLetterAfter(line, n.end)) return false;
    if (range && n.start >= range.start && n.end <= range.end) return false;
    return true;
  });

  const valueNum = nums.length > 0 ? nums[0].num : null;
  const valueRaw = nums.length > 0 ? nums[0].raw : null;

  let status: AiTestResult['status'] = 'unknown';
  let direction: 'high' | 'low' | null = null;

  if (valueNum !== null && range) {
    if (valueNum > range.max) {
      status = 'high';
      direction = 'high';
    } else if (valueNum < range.min) {
      status = 'low';
      direction = 'low';
    } else {
      status = 'normal';
    }
  } else if (valueNum !== null && entry.refMin !== undefined && entry.refMax !== undefined) {
    if (valueNum > entry.refMax) {
      status = 'high';
      direction = 'high';
    } else if (valueNum < entry.refMin) {
      status = 'low';
      direction = 'low';
    } else {
      status = 'normal';
    }
  } else if (valueNum === null && range) {
    // Range present but no measured value on the line — cannot assess
    status = 'unknown';
  }

  return {
    entry,
    valueNum,
    valueRaw,
    status,
    direction,
    unit: findUnit(line, entry),
    referenceRange: range ? `${range.min}–${range.max}` : null,
  };
}

function dedupe(list: string[]): string[] {
  const seen = new Set<string>();
  return list.filter((item) => {
    const key = String(item).trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

@Injectable()
export class MockAiProvider implements AiProvider {
  readonly name = 'mock';

  async analyze(text: string): Promise<AiAnalysisResult> {
    const lines = String(text || '')
      .split(/\r?\n/)
      .map(cleanLine)
      .filter(Boolean);

    const items: AiTestResult[] = [];
    const seenTests = new Set<string>();

    for (const line of lines) {
      let bestEntry: KnowledgeEntry | null = null;
      let bestAlias: { start: number; end: number; length: number } | null = null;
      for (const entry of KNOWLEDGE_BASE) {
        const a = matchAlias(line, entry);
        if (a && (bestAlias === null || a.start < bestAlias.start || (a.start === bestAlias.start && a.length > bestAlias.length))) {
          bestAlias = a;
          bestEntry = entry;
        }
      }
      if (!bestEntry || !bestAlias) continue;

      const parsed = parseLine(line, bestEntry);
      if (!parsed || parsed.valueNum === null) continue;

      const key = bestEntry.id;
      if (seenTests.has(key)) continue;
      seenTests.add(key);

      const high = parsed.direction === 'high';
      const low = parsed.direction === 'low';
      const abnormal = high || low;

      const associatedConditions = high ? bestEntry.associatedHigh : low ? bestEntry.associatedLow : [];
      const symptoms = high ? bestEntry.symptomsHigh : low ? bestEntry.symptomsLow : [];
      const prevention = high ? bestEntry.preventionHigh : low ? bestEntry.preventionLow : [];
      const nutrition = high ? bestEntry.nutritionHigh : low ? bestEntry.nutritionLow : [];
      const lifestyle = high ? bestEntry.lifestyleHigh : low ? bestEntry.lifestyleLow : [];
      const followUpTests = high ? bestEntry.followUpHigh : low ? bestEntry.followUpLow : [];
      const consultAdvice = abnormal
        ? `Since your ${bestEntry.name} is ${parsed.direction}, it is a good idea to discuss this result with your healthcare provider to interpret it in the context of your overall health.`
        : 'No immediate consultation is needed for this result, but discuss it with your doctor during your next visit.';

      items.push({
        name: bestEntry.name,
        category: bestEntry.category,
        value: parsed.valueRaw!,
        unit: parsed.unit,
        referenceRange: parsed.referenceRange ?? (bestEntry.refMin !== undefined && bestEntry.refMax !== undefined
          ? `${bestEntry.refMin}–${bestEntry.refMax}`
          : null),
        status: parsed.status,
        direction: parsed.direction,
        explanation: bestEntry.explanation,
        whyItMatters: bestEntry.whyItMatters,
        highMeaning: high ? bestEntry.highMeaning : null,
        lowMeaning: low ? bestEntry.lowMeaning : null,
        associatedConditions,
        symptoms,
        prevention,
        nutrition,
        lifestyle,
        followUpTests,
        consultAdvice,
      });
    }

    const insights = items
      .filter((i) => i.direction)
      .map((i) => ({
        id: i.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        test: i.name,
        insight:
          i.direction === 'high'
            ? i.highMeaning ?? `${i.name} is above the typical range.`
            : i.lowMeaning ?? `${i.name} is below the typical range.`,
      }));

    const symptoms = dedupe(items.flatMap((i) => i.symptoms));
    const prevention = dedupe(items.flatMap((i) => i.prevention));
    const consult = items.filter((i) => i.direction).map((i) => ({ test: i.name, advice: i.consultAdvice }));

    const abnormalCount = items.filter((i) => i.direction).length;
    const totalCount = items.length;

    let healthScore = 100;
    if (totalCount > 0) {
      healthScore -= Math.round((abnormalCount / totalCount) * 50);
    }
    healthScore -= Math.min(20, abnormalCount * 3);
    healthScore = Math.max(20, Math.min(100, healthScore));

    let riskLevel: AiAnalysisResult['riskLevel'] = 'low';
    if (abnormalCount >= 4 || healthScore < 45) riskLevel = 'high';
    else if (abnormalCount >= 2 || healthScore < 70) riskLevel = 'moderate';

    const overallSummary =
      totalCount === 0
        ? 'The report text was received, but no recognizable medical tests could be matched. Consider uploading a clearer scan or retrying with the AI engine enabled.'
        : `We identified ${totalCount} test${totalCount === 1 ? '' : 's'}: ${abnormalCount} out of range. ${abnormalCount === 0 ? 'All identified values fall within their typical reference ranges.' : 'The out-of-range values are highlighted below with educational explanations. Please review them with a healthcare professional.'} Overall, your current risk level is estimated as ${riskLevel}.`;

    return {
      overallSummary,
      healthScore,
      riskLevel,
      tests: items,
      insights,
      symptoms,
      prevention,
      consult,
      disclaimer: DISCLAIMER,
    };
  }
}
