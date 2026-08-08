import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenType, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { serializeUser, PublicUser } from '../users/serializers/user.serializer';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokensService } from './tokens.service';

const BCRYPT_ROUNDS = 12;

export interface AuthSession {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly tokens: TokensService,
    private readonly email: EmailService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthSession> {
    const email = dto.email.toLowerCase();
    const existing = await this.users.findByEmail(email);
    if (existing) throw new ConflictException('An account with this email already exists');

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: dto.fullName.trim(),
        phoneNumber: dto.phoneNumber ?? null,
        gender: dto.gender ?? null,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        preferredLanguage: dto.preferredLanguage ?? 'en',
      },
    });

    await this.sendVerificationEmail(user);

    const refresh = await this.tokens.createRefreshToken(user.id);
    const accessToken = await this.tokens.createAccessToken(user);

    return {
      user: serializeUser(user),
      accessToken,
      refreshToken: refresh.rawToken,
    };
  }

  async login(dto: LoginDto): Promise<AuthSession> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) throw new UnauthorizedException('Invalid email or password');

    if (!user.emailVerifiedAt && this.config.get<string>('env') !== 'development') {
      throw new ForbiddenException('Email not verified. Please check your inbox to verify your account.');
    }

    const refresh = await this.tokens.createRefreshToken(user.id);
    const accessToken = await this.tokens.createAccessToken(user);

    return {
      user: serializeUser(user),
      accessToken,
      refreshToken: refresh.rawToken,
    };
  }

  async refresh(rawRefreshToken: string, userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.users.findById(userId);
    const rotated = await this.tokens.rotateRefreshToken(rawRefreshToken, user.id);
    return {
      accessToken: await this.tokens.createAccessToken(user),
      refreshToken: rotated.rawToken,
    };
  }

  async logout(rawRefreshToken: string, userId: string): Promise<void> {
    const recordId = await this.tokens.validateRefreshToken(rawRefreshToken, userId);
    await this.tokens.revokeRefreshToken(recordId);
  }

  async verifyEmail(token: string): Promise<void> {
    const { tokenId, userId } = await this.tokens.validateEmailToken(token, TokenType.EMAIL_VERIFICATION);
    await this.tokens.consumeToken(tokenId);
    await this.prisma.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } });
  }

  async resendVerification(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.users.findByEmail(dto.email);
    if (!user || user.emailVerifiedAt) return;
    await this.sendVerificationEmail(user);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) return;

    const { rawToken } = await this.tokens.createEmailToken(user.id, TokenType.PASSWORD_RESET, 1);
    const link = `${this.config.get<string>('clientUrl')}/reset-password?token=${encodeURIComponent(rawToken)}`;
    await this.email.send({
      to: user.email,
      subject: 'Reset your AI MedCheck password',
      template: 'reset-password',
      data: { name: user.fullName.split(' ')[0], link },
    });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const { tokenId, userId } = await this.tokens.validateEmailToken(dto.token, TokenType.PASSWORD_RESET);
    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    await this.tokens.consumeToken(tokenId);
    await this.tokens.revokeAllUserRefreshTokens(userId);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.users.findById(userId);
    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    await this.tokens.revokeAllUserRefreshTokens(userId);
  }

  private async sendVerificationEmail(user: User): Promise<void> {
    const { rawToken } = await this.tokens.createEmailToken(user.id, TokenType.EMAIL_VERIFICATION, 24);
    const link = `${this.config.get<string>('clientUrl')}/verify-email?token=${encodeURIComponent(rawToken)}`;
    await this.email.send({
      to: user.email,
      subject: 'Verify your AI MedCheck email',
      template: 'verify-email',
      data: { name: user.fullName.split(' ')[0], link },
    });
  }
}
