import { Gender, Role, User } from '@prisma/client';

export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  age: number | null;
  preferredLanguage: string;
  profilePictureUrl: string | null;
  emailVerifiedAt: string | null;
  role: Role;
  createdAt: string;
}

export function calculateAge(dateOfBirth: Date): number | null {
  const now = new Date();
  let age = now.getFullYear() - dateOfBirth.getFullYear();
  const m = now.getMonth() - dateOfBirth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dateOfBirth.getDate())) age -= 1;
  return age >= 0 ? age : null;
}

export function serializeUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().slice(0, 10) : null,
    age: user.dateOfBirth ? calculateAge(user.dateOfBirth) : null,
    preferredLanguage: user.preferredLanguage,
    profilePictureUrl: user.profilePictureUrl,
    emailVerifiedAt: user.emailVerifiedAt ? user.emailVerifiedAt.toISOString() : null,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}
