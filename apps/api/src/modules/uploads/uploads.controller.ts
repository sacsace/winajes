import {
  BadRequestException, Controller, Post, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const uploadDir = join(process.cwd(), 'uploads', 'projects');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

@Controller('api/uploads')
export class UploadsController {
  @Post('project-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname).toLowerCase()}`;
          cb(null, unique);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp|gif)$/)) {
          return cb(new BadRequestException('Only image files are allowed') as never, false);
        }
        cb(null, true);
      },
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  uploadProjectImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    const baseUrl = process.env.API_PUBLIC_URL || 'http://localhost:3001';
    return {
      url: `${baseUrl}/uploads/projects/${file.filename}`,
      filename: file.filename,
    };
  }
}
