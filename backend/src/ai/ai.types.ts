export type TestStatus = 'high' | 'low' | 'normal' | 'unknown';
export type RiskLevel = 'low' | 'moderate' | 'high';

export interface AiTestResult {
  name: string;
  category: string;
  value: string;
  unit: string | null;
  referenceRange: string | null;
  status: TestStatus;
  direction: 'high' | 'low' | null;
  explanation: string;
  whyItMatters: string;
  highMeaning: string | null;
  lowMeaning: string | null;
  associatedConditions: string[];
  symptoms: string[];
  prevention: string[];
  nutrition: string[];
  lifestyle: string[];
  followUpTests: string[];
  consultAdvice: string;
}

export interface AiInsight {
  id: string;
  test: string;
  insight: string;
}

export interface AiConsult {
  test: string;
  advice: string;
}

export interface AiAnalysisResult {
  overallSummary: string;
  healthScore: number;
  riskLevel: RiskLevel;
  tests: AiTestResult[];
  insights: AiInsight[];
  symptoms: string[];
  prevention: string[];
  consult: AiConsult[];
  disclaimer: string;
}

export interface AiProvider {
  readonly name: string;
  analyze(text: string): Promise<AiAnalysisResult>;
}
