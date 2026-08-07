import { MockAiProvider } from './mock.provider';

const SAMPLE_REPORT = `
                Patient: Test Person    Age: 45    Gender: M
                Sample collected: 2024-01-05

                COMPLETE BLOOD COUNT
                Hemoglobin         14.2 g/dL    13.0 - 17.0
                WBC                12.5 10^3/uL  4.0 - 11.0
                Platelets          180 10^3/uL   150 - 450

                METABOLIC PANEL
                Glucose (Fasting)  145 mg/dL     70 - 100
                HbA1c              6.8 %         4.0 - 5.6

                LIPID PANEL
                Total Cholesterol  210 mg/dL     0 - 200
                LDL Cholesterol    130 mg/dL     0 - 100
                HDL Cholesterol    35 mg/dL      40 - 100
                Triglycerides      120 mg/dL     0 - 150
`;

describe('MockAiProvider', () => {
  let provider: MockAiProvider;

  beforeEach(() => {
    provider = new MockAiProvider();
  });

  it('identifies tests and values from report text', async () => {
    const result = await provider.analyze(SAMPLE_REPORT);

    expect(result.tests.length).toBeGreaterThan(0);
    const names = result.tests.map((t) => t.name);
    expect(names).toContain('Hemoglobin');
    expect(names).toContain('White Blood Cells');
    expect(names).toContain('Glucose (Fasting)');
    expect(names).toContain('Total Cholesterol');
  });

  it('flags high glucose and low HDL correctly', async () => {
    const result = await provider.analyze(SAMPLE_REPORT);

    const glucose = result.tests.find((t) => t.name.includes('Glucose'));
    expect(glucose).toBeDefined();
    expect(glucose!.status).toBe('high');
    expect(glucose!.direction).toBe('high');

    const hdl = result.tests.find((t) => t.name.includes('HDL'));
    expect(hdl).toBeDefined();
    expect(hdl!.status).toBe('low');
    expect(hdl!.direction).toBe('low');
  });

  it('classifies in-range values as normal', async () => {
    const result = await provider.analyze(SAMPLE_REPORT);
    const hemoglobin = result.tests.find((t) => t.name === 'Hemoglobin');
    expect(hemoglobin).toBeDefined();
    expect(hemoglobin!.status).toBe('normal');
  });

  it('produces a structured educational response with a disclaimer', async () => {
    const result = await provider.analyze(SAMPLE_REPORT);

    expect(result.healthScore).toBeGreaterThanOrEqual(0);
    expect(result.healthScore).toBeLessThanOrEqual(100);
    expect(['low', 'moderate', 'high']).toContain(result.riskLevel);
    expect(result.overallSummary).toBeTruthy();
    expect(result.disclaimer).toContain('educational');
    expect(Array.isArray(result.insights)).toBe(true);
    expect(result.tests.every((t) => typeof t.explanation === 'string')).toBe(true);
    expect(result.tests.every((t) => typeof t.whyItMatters === 'string')).toBe(true);
  });

  it('handles empty input gracefully', async () => {
    const result = await provider.analyze('');
    expect(result.tests).toEqual([]);
    expect(result.healthScore).toBe(100);
    expect(result.riskLevel).toBe('low');
  });
});
