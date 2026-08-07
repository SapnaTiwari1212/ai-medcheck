import { Gender, Role, User } from '@prisma/client';
import { calculateAge, serializeUser } from './user.serializer';

const makeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-1',
    email: 'jane@example.com',
    passwordHash: 'secret-hash',
    fullName: 'Jane Doe',
    phoneNumber: null,
    gender: Gender.FEMALE,
    dateOfBirth: new Date('1990-06-15'),
    preferredLanguage: 'en',
    profilePictureUrl: null,
    emailVerifiedAt: new Date('2024-01-01'),
    role: Role.USER,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    deletedAt: null,
    ...overrides,
  }) as User;

describe('serializeUser', () => {
  it('never exposes the password hash', () => {
    const serialized = serializeUser(makeUser());
    expect('passwordHash' in serialized).toBe(false);
  });

  it('formats dates as ISO strings', () => {
    const serialized = serializeUser(makeUser());
    expect(serialized.dateOfBirth).toBe('1990-06-15');
    expect(serialized.emailVerifiedAt).toMatch(/^2024-01-01T/);
  });

  it('returns null for missing optional fields', () => {
    const serialized = serializeUser(makeUser({ dateOfBirth: null, emailVerifiedAt: null }));
    expect(serialized.dateOfBirth).toBeNull();
    expect(serialized.age).toBeNull();
    expect(serialized.emailVerifiedAt).toBeNull();
  });
});

describe('calculateAge', () => {
  it('computes age correctly for a past birthday this year', () => {
    const age = calculateAge(new Date('1990-01-01'));
    expect(age).toBe(new Date().getFullYear() - 1990);
  });

  it('returns null when the date is in the future', () => {
    expect(calculateAge(new Date(Date.now() + 100000000))).toBeNull();
  });
});
