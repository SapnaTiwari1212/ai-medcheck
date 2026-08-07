import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { extname, join } from 'path';
import { uuid } from '../common/utils/crypto.util';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

const PROFILE_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

export interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const data: Record<string, unknown> = {};
    if (dto.fullName !== undefined) data.fullName = dto.fullName;
    if (dto.phoneNumber !== undefined) data.phoneNumber = dto.phoneNumber || null;
    if (dto.gender !== undefined) data.gender = dto.gender;
    if (dto.dateOfBirth !== undefined) data.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.preferredLanguage !== undefined) data.preferredLanguage = dto.preferredLanguage;

    return this.prisma.user.update({ where: { id: userId }, data });
  }

  async updateProfilePicture(userId: string, file: MulterFile): Promise<User> {
    const extension = extname(file.originalname).toLowerCase();
    if (!PROFILE_IMAGE_EXTENSIONS.includes(extension)) {
      throw new Error('Profile picture must be a JPG, PNG or WebP image');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new Error('Profile picture must be an image file');
    }
    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      throw new Error('Profile picture must be 5 MB or smaller');
    }

    const user = await this.findById(userId);
    const key = join('profiles', userId, `${uuid()}${extension}`).replace(/\\/g, '/');
    const uploaded = await this.storage.save(file.buffer, {
      key,
      mimeType: file.mimetype,
      originalName: file.originalname,
    });

    if (user.profilePictureUrl && this.storage.provider === 'LOCAL') {
      await this.storage.delete(extractLocalKey(user.profilePictureUrl));
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { profilePictureUrl: uploaded.url },
    });
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.findById(userId);
    const reports = await this.prisma.report.findMany({
      where: { userId, deletedAt: null },
      select: { storageKey: true, storageProvider: true },
    });

    for (const report of reports) {
      await this.storage.delete(report.storageKey).catch(() => undefined);
    }
    if (user.profilePictureUrl) {
      await this.storage.delete(extractLocalKey(user.profilePictureUrl)).catch(() => undefined);
    }

    await this.prisma.user.delete({ where: { id: userId } });
  }
}

function extractLocalKey(url: string): string {
  const segments = url.split('/');
  const index = segments.findIndex((segment) => segment === 'uploads');
  if (index >= 0) return segments.slice(index + 1).join('/');
  return url;
}
