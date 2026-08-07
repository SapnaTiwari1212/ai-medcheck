import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { renderEmailTemplate } from './templates';

export interface SendMailInput {
  to: string;
  subject: string;
  template: 'welcome' | 'verify-email' | 'reset-password';
  data: Record<string, string>;
}

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailService.name);
  private transporter?: Transporter;
  private readonly provider: 'console' | 'ethereal' | 'smtp';
  private readonly from: string;
  private readonly devRecipient: string;

  constructor(private readonly config: ConfigService) {
    this.provider = this.config.get<'console' | 'ethereal' | 'smtp'>('email.provider') ?? 'console';
    this.from = this.config.get<string>('email.from') ?? 'AI MedCheck <no-reply@aimedcheck.com>';
    this.devRecipient = this.config.get<string>('email.devRecipient') ?? '';
  }

  async onModuleInit(): Promise<void> {
    switch (this.provider) {
      case 'ethereal': {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
        this.logger.log(
          `Ethereal email ready — previews: https://ethereal.email/messages (${testAccount.user})`,
        );
        break;
      }
      case 'smtp': {
        this.transporter = nodemailer.createTransport({
          host: this.config.get<string>('email.smtpHost')!,
          port: this.config.get<number>('email.smtpPort') ?? 587,
          secure: (this.config.get<boolean>('email.smtpSecure') ?? false) === true,
          auth: {
            user: this.config.get<string>('email.smtpUser')!,
            pass: this.config.get<string>('email.smtpPass')!,
          },
        });
        this.logger.log('SMTP email ready');
        break;
      }
      default:
        this.logger.log('Email provider "console" — messages are logged, not sent');
    }
  }

  async send(input: SendMailInput): Promise<void> {
    const html = renderEmailTemplate(input.template, input.data);
    const recipient = input.to;

    if (this.provider === 'console' || !this.transporter) {
      this.logger.log(`[EMAIL] to=${recipient} subject="${input.subject}"`);
      this.logger.log(`[EMAIL] preview="${htmlPreview(html)}"`);
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to: recipient,
        subject: input.subject,
        html,
      });
      if (this.provider === 'ethereal' && info.messageId) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) this.logger.log(`Ethereal preview: ${previewUrl}`);
      }
    } catch (err) {
      this.logger.error(`Failed to send email to ${recipient}: ${(err as Error).message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.transporter) this.transporter.close();
  }
}

function htmlPreview(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
}
