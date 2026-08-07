import { ConflictException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Gender, Role, TokenType, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser, serializeUser } from '../users/serializers/user.serializer';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokensService } from './tokens.service';

jest.mock('bcryptjs', () => {
  const actual = jest.requireActual('bcryptjs');
  return {
    ...actual,
    compare: jest.fn(),
    hash: jest.fn(),
    genSalt: jest.fn(),
  };
});

const makeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-1',
    email: 'jane@example.com',
    passwordHash: '$2a$12$hashed',
    fullName: 'Jane Doe',
    phoneNumber: null,
    gender: Gender.FEMALE,
    dateOfBirth: new Date('1990-01-01'),
    preferredLanguage: 'en',
    profilePictureUrl: null,
    emailVerifiedAt: new Date(),
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  }) as User;

const mockConfig = {
  get: jest.fn((key: string) => {
    const values: Record<string, unknown> = {
      clientUrl: 'http://localhost:5173',
      jwtRefreshSecret: 'refresh-secret',
      jwtRefreshExpiresIn: '30d',
    };
    return values[key];
  }),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: { create: jest.Mock; update: jest.Mock } };
  let users: { findByEmail: jest.Mock; findById: jest.Mock };
  let tokens: Record<string, jest.Mock>;
  let email: { send: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
        update: jest.fn(),
      },
    };
    users = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };
    tokens = {
      createRefreshToken: jest.fn(),
      createAccessToken: jest.fn(),
      rotateRefreshToken: jest.fn(),
      validateRefreshToken: jest.fn(),
      revokeRefreshToken: jest.fn(),
      revokeAllUserRefreshTokens: jest.fn(),
      createEmailToken: jest.fn(),
      validateEmailToken: jest.fn(),
      consumeToken: jest.fn(),
    };
    email = { send: jest.fn() };
    jest.clearAllMocks();
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('$2a$12$hashed');

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: users },
        { provide: TokensService, useValue: tokens },
        { provide: EmailService, useValue: email },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('register', () => {
    const dto: RegisterDto = {
      email: 'Jane@Example.com',
      password: 'SecurePass123',
      fullName: 'Jane Doe',
      gender: Gender.FEMALE,
      preferredLanguage: 'en',
    };

    it('creates a user with a hashed password and returns a session', async () => {
      const user = makeUser({ email: 'jane@example.com' });
      users.findByEmail.mockResolvedValue(null);
      prisma.user.create.mockImplementation(({ data }) => ({
        ...user,
        email: data.email,
        passwordHash: data.passwordHash,
      }));
      tokens.createEmailToken.mockResolvedValue({ rawToken: 'verify-token', tokenId: 't1' });
      tokens.createRefreshToken.mockResolvedValue({ rawToken: 'refresh-raw', recordId: 'r1', expiresAt: new Date() });
      tokens.createAccessToken.mockResolvedValue('access-token');

      const result = await service.register(dto);

      expect(users.findByEmail).toHaveBeenCalledWith('jane@example.com');
      const created = prisma.user.create.mock.calls[0][0].data;
      expect(created.email).toBe('jane@example.com');
      expect(created.passwordHash).not.toBe(dto.password);
      expect(await bcrypt.compare(dto.password, created.passwordHash)).toBe(true);
      expect(email.send).toHaveBeenCalledWith(
        expect.objectContaining({ template: 'verify-email', to: 'jane@example.com' }),
      );
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-raw');
      expect(result.user.email).toBe('jane@example.com');
    });

    it('throws ConflictException when the email is already registered', async () => {
      users.findByEmail.mockResolvedValue(makeUser());
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const dto: LoginDto = { email: 'jane@example.com', password: 'SecurePass123' };

    it('throws UnauthorizedException for unknown email', async () => {
      users.findByEmail.mockResolvedValue(null);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for a wrong password', async () => {
      users.findByEmail.mockResolvedValue(makeUser());
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws ForbiddenException when email is not verified', async () => {
      const user = makeUser({ emailVerifiedAt: null });
      users.findByEmail.mockResolvedValue(user);
      await expect(service.login(dto)).rejects.toThrow(ForbiddenException);
    });

    it('returns a session for valid credentials', async () => {
      const user = makeUser();
      users.findByEmail.mockResolvedValue(user);
      tokens.createRefreshToken.mockResolvedValue({ rawToken: 'refresh-raw', recordId: 'r1', expiresAt: new Date() });
      tokens.createAccessToken.mockResolvedValue('access-token');

      const result = await service.login(dto);
      expect(result.user.email).toBe('jane@example.com');
      expect(result.accessToken).toBe('access-token');
    });
  });

  describe('refresh', () => {
    it('rotates the refresh token and returns a new pair', async () => {
      const user = makeUser();
      users.findById.mockResolvedValue(user);
      tokens.rotateRefreshToken.mockResolvedValue({ rawToken: 'new-refresh', recordId: 'r2', expiresAt: new Date() });
      tokens.createAccessToken.mockResolvedValue('new-access');

      const result = await service.refresh('old-refresh', user.id);
      expect(tokens.rotateRefreshToken).toHaveBeenCalledWith('old-refresh', user.id);
      expect(result).toEqual({ accessToken: 'new-access', refreshToken: 'new-refresh' });
    });
  });

  describe('logout', () => {
    it('validates and revokes the refresh token', async () => {
      tokens.validateRefreshToken.mockResolvedValue('r1');
      await service.logout('refresh-token', 'user-1');
      expect(tokens.validateRefreshToken).toHaveBeenCalledWith('refresh-token', 'user-1');
      expect(tokens.revokeRefreshToken).toHaveBeenCalledWith('r1');
    });
  });

  describe('verifyEmail', () => {
    it('consumes the token and marks the user as verified', async () => {
      tokens.validateEmailToken.mockResolvedValue({ tokenId: 't1', userId: 'user-1' });
      tokens.consumeToken.mockResolvedValue(undefined);
      prisma.user.update.mockResolvedValue(makeUser());

      await service.verifyEmail('raw-token');

      expect(tokens.validateEmailToken).toHaveBeenCalledWith('raw-token', TokenType.EMAIL_VERIFICATION);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'user-1' } }),
      );
    });
  });

  describe('resetPassword', () => {
    it('hashes the new password, consumes the token and revokes sessions', async () => {
      tokens.validateEmailToken.mockResolvedValue({ tokenId: 't1', userId: 'user-1' });
      prisma.user.update.mockResolvedValue(makeUser());

      await service.resetPassword({ token: 'raw-token', newPassword: 'NewPass123' });

      const updateCall = prisma.user.update.mock.calls[0][0];
      expect(updateCall.where.id).toBe('user-1');
      expect(updateCall.data.passwordHash).not.toBe('NewPass123');
      expect(await bcrypt.compare('NewPass123', updateCall.data.passwordHash)).toBe(true);
      expect(tokens.consumeToken).toHaveBeenCalledWith('t1');
      expect(tokens.revokeAllUserRefreshTokens).toHaveBeenCalledWith('user-1');
    });
  });

  describe('changePassword', () => {
    it('throws BadRequestException when the current password is wrong', async () => {
      users.findById.mockResolvedValue(makeUser());
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(
        service.changePassword('user-1', { currentPassword: 'WrongPass123', newPassword: 'NewPass123' }),
      ).rejects.toThrow('Current password is incorrect');
    });

    it('updates the password and revokes sessions on success', async () => {
      users.findById.mockResolvedValue(makeUser());
      prisma.user.update.mockResolvedValue(makeUser());

      await service.changePassword('user-1', { currentPassword: 'OldPass123', newPassword: 'NewPass123' });

      expect(tokens.revokeAllUserRefreshTokens).toHaveBeenCalledWith('user-1');
    });
  });

  describe('forgotPassword', () => {
    it('does not send an email for unknown users (anti-enumeration)', async () => {
      users.findByEmail.mockResolvedValue(null);
      await service.forgotPassword({ email: 'nobody@example.com' });
      expect(email.send).not.toHaveBeenCalled();
    });

    it('sends a reset email for a known user', async () => {
      users.findByEmail.mockResolvedValue(makeUser());
      tokens.createEmailToken.mockResolvedValue({ rawToken: 'reset-token', tokenId: 't1' });

      await service.forgotPassword({ email: 'jane@example.com' });

      expect(email.send).toHaveBeenCalledWith(
        expect.objectContaining({ template: 'reset-password', to: 'jane@example.com' }),
      );
    });
  });

  describe('serializeUser', () => {
    it('computes age from the date of birth and never exposes the hash', () => {
      const serialized: PublicUser = serializeUser(makeUser());
      expect(serialized.age).toBeGreaterThanOrEqual(30);
      expect(serialized.dateOfBirth).toBe('1990-01-01');
      expect('passwordHash' in serialized).toBe(false);
    });
  });
});
