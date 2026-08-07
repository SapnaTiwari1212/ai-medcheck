import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenType, User } from '@prisma/client';
import { JwtPayload } from '../common/types/auth.types';
import { generateRandomToken, sha256 } from '../common/utils/crypto.util';
import { PrismaService } from '../prisma/prisma.service';

type EmailTokenType = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';

export interface RefreshTokenResult {
  rawToken: string;
  recordId: string;
  expiresAt: Date;
}

export interface EmailTokenResult {
  rawToken: string;
  tokenId: string;
}

@Injectable()
export class TokensService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  createAccessToken(user: Pick<User, 'id' | 'email' | 'role'>): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    };
    return this.jwt.signAsync(payload);
  }

  async createRefreshToken(userId: string): Promise<RefreshTokenResult> {
    const expiresIn = this.config.get<string>('jwt.refreshExpiresIn') ?? '30d';
    const record = await this.prisma.token.create({
      data: {
        userId,
        type: TokenType.REFRESH,
        tokenHash: 'pending',
        expiresAt: new Date(Date.now() + parseDuration(expiresIn)),
      },
    });

    const payload: JwtPayload = {
      sub: userId,
      email: '',
      role: 'USER',
      type: 'refresh',
      jti: record.id,
    };

    const rawToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: expiresIn as JwtSignOptions['expiresIn'],
    });

    await this.prisma.token.update({
      where: { id: record.id },
      data: { tokenHash: sha256(rawToken) },
    });

    return { rawToken, recordId: record.id, expiresAt: record.expiresAt };
  }

  async validateRefreshToken(rawToken: string, userId: string): Promise<string> {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(rawToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh' || payload.sub !== userId || !payload.jti) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const record = await this.prisma.token.findUnique({ where: { id: payload.jti } });
    if (!record || record.type !== TokenType.REFRESH) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (record.usedAt || record.revokedAt) {
      throw new UnauthorizedException('Refresh token has already been used or revoked');
    }
    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }
    if (record.tokenHash !== sha256(rawToken)) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    return record.id;
  }

  async verifyRefreshCookie(rawToken: string): Promise<{ userId: string; recordId: string }> {
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(rawToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });
      if (payload.type !== 'refresh' || !payload.sub || !payload.jti) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return { userId: payload.sub, recordId: payload.jti };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async rotateRefreshToken(rawToken: string, userId: string): Promise<RefreshTokenResult> {
    const oldId = await this.validateRefreshToken(rawToken, userId);
    await this.prisma.token.update({
      where: { id: oldId },
      data: { usedAt: new Date() },
    });
    return this.createRefreshToken(userId);
  }

  async revokeRefreshToken(recordId: string): Promise<void> {
    await this.prisma.token.updateMany({
      where: { id: recordId, type: TokenType.REFRESH },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this.prisma.token.updateMany({
      where: { userId, type: TokenType.REFRESH, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async createEmailToken(
    userId: string,
    type: EmailTokenType,
    ttlHours: number,
  ): Promise<EmailTokenResult> {
    const rawToken = generateRandomToken(32);
    const record = await this.prisma.token.create({
      data: {
        userId,
        type,
        tokenHash: sha256(rawToken),
        expiresAt: new Date(Date.now() + ttlHours * 60 * 60 * 1000),
      },
    });
    return { rawToken, tokenId: record.id };
  }

  async validateEmailToken(
    rawToken: string,
    type: EmailTokenType,
  ): Promise<{ tokenId: string; userId: string }> {
    const record = await this.prisma.token.findFirst({
      where: { tokenHash: sha256(rawToken), type },
    });
    if (!record || record.usedAt || record.revokedAt) {
      throw new UnauthorizedException('Token is invalid or has already been used');
    }
    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException('Token has expired');
    }
    return { tokenId: record.id, userId: record.userId };
  }

  async consumeToken(tokenId: string): Promise<void> {
    await this.prisma.token.update({ where: { id: tokenId }, data: { usedAt: new Date() } });
  }
}

function parseDuration(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) return 30 * 24 * 60 * 60 * 1000;
  const amount = parseInt(match[1], 10);
  const multipliers: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return amount * multipliers[match[2]];
}
