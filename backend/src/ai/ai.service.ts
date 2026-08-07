import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiAnalysisResult, AiProvider } from './ai.types';
import { MockAiProvider } from './providers/mock.provider';
import { OpenAiProvider } from './providers/openai.provider';

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private provider: AiProvider;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const configured = this.config.get<'openai' | 'mock'>('ai.provider') ?? 'mock';
    const apiKey = this.config.get<string>('ai.openaiApiKey') ?? '';

    if (configured === 'openai' && apiKey) {
      this.provider = new OpenAiProvider({
        apiKey,
        model: this.config.get<string>('ai.openaiModel') ?? 'gpt-4o-mini',
        maxTokens: this.config.get<number>('ai.openaiMaxTokens') ?? 6000,
      });
      this.logger.log('AI provider active: openai');
    } else {
      this.provider = new MockAiProvider();
      this.logger.log(
        'AI provider active: mock (set AI_PROVIDER=openai and OPENAI_API_KEY for AI-powered analysis)',
      );
    }
  }

  get providerName(): string {
    return this.provider.name;
  }

  analyze(text: string): Promise<AiAnalysisResult> {
    return this.provider.analyze(text);
  }
}
