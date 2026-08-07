import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { AiAnalysisResult, AiProvider } from '../ai.types';
import { ANALYSIS_SCHEMA } from '../prompts/analysis-schema';
import { SYSTEM_PROMPT } from '../prompts/system-prompt';

export interface OpenAiProviderOptions {
  apiKey: string;
  model: string;
  maxTokens: number;
}

const MAX_INPUT_CHARS = 60000;

@Injectable()
export class OpenAiProvider implements AiProvider {
  readonly name = 'openai';
  private readonly logger = new Logger(OpenAiProvider.name);
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly maxTokens: number;

  constructor(options: OpenAiProviderOptions) {
    this.client = new OpenAI({ apiKey: options.apiKey });
    this.model = options.model;
    this.maxTokens = options.maxTokens;
  }

  async analyze(text: string): Promise<AiAnalysisResult> {
    const startedAt = Date.now();
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analyze the extracted text from this medical laboratory report.\n\nREPORT TEXT:\n"""\n${text.slice(0, MAX_INPUT_CHARS)}\n"""`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'analysis_result',
          strict: true,
          schema: ANALYSIS_SCHEMA as unknown as Record<string, unknown>,
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('AI returned an empty response');

    const parsed = JSON.parse(content) as Partial<AiAnalysisResult>;
    this.logger.log(
      `OpenAI analysis complete in ${Date.now() - startedAt}ms (model=${this.model}, tokens=${response.usage?.total_tokens ?? 'n/a'})`,
    );
    return this.sanitize(parsed);
  }

  private sanitize(parsed: Partial<AiAnalysisResult>): AiAnalysisResult {
    const tests = Array.isArray(parsed.tests) ? parsed.tests : [];
    const symptomSet = dedupe(tests.flatMap((t) => t.symptoms ?? []));
    const preventionSet = dedupe(tests.flatMap((t) => t.prevention ?? []));
    const consult = Array.isArray(parsed.consult) ? parsed.consult : [];

    return {
      overallSummary: String(parsed.overallSummary ?? 'The report could not be fully summarized.'),
      healthScore: clampHealthScore(Number(parsed.healthScore)),
      riskLevel: ['low', 'moderate', 'high'].includes(String(parsed.riskLevel))
        ? (parsed.riskLevel as AiAnalysisResult['riskLevel'])
        : 'moderate',
      tests,
      insights: Array.isArray(parsed.insights) ? parsed.insights : [],
      symptoms: symptomSet.length > 0 ? symptomSet : Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
      prevention:
        preventionSet.length > 0 ? preventionSet : Array.isArray(parsed.prevention) ? parsed.prevention : [],
      consult: consult.length > 0 ? consult : tests.map((t) => ({ test: t.name, advice: t.consultAdvice })).filter((c) => c.advice),
      disclaimer: DISCLAIMER,
    };
  }
}

export const DISCLAIMER =
  'This analysis is educational only. It is not a diagnosis, and it does not replace professional medical advice. Always discuss your results with a qualified healthcare professional.';

function dedupe(list: string[]): string[] {
  const seen = new Set<string>();
  return list.filter((item) => {
    const key = String(item).trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function clampHealthScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
