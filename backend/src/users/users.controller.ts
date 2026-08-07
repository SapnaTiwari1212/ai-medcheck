import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { memoryStorage } from 'multer';
import { AuthUser } from '../common/types/auth.types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PublicUser, serializeUser } from './serializers/user.serializer';
import { MulterFile, UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the current user profile' })
  async getMe(@CurrentUser() user: AuthUser): Promise<PublicUser> {
    return serializeUser(await this.usersService.findById(user.id));
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the current user profile' })
  async updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto): Promise<PublicUser> {
    return serializeUser(await this.usersService.updateProfile(user.id, dto));
  }

  @Post('me/picture')
  @ApiOperation({ summary: 'Upload a profile picture (JPG, PNG, WebP, max 5 MB)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadPicture(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: MulterFile,
  ): Promise<PublicUser> {
    if (!file) throw new Error('No file provided');
    return serializeUser(await this.usersService.updateProfilePicture(user.id, file));
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete the current user account and all data' })
  async deleteAccount(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    await this.usersService.deleteAccount(user.id);
    this.clearAuthCookies(res);
    return { message: 'Account deleted successfully' };
  }

  private clearAuthCookies(res: Response): void {
    const secure = this.config.get<boolean>('cookie.secure') === true;
    const sameSite = this.config.get<string>('cookie.sameSite') as 'lax' | 'strict' | 'none';
    for (const name of ['access_token', 'refresh_token']) {
      res.clearCookie(name, { httpOnly: true, secure, sameSite, path: '/' });
    }
  }
}
