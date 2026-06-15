import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkerDocument } from '../workers/schemas/worker.schema';
import { photoMulterOptions } from './photos.multer';
import { PhotosService } from './photos.service';

@Controller('photos')
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('photo', photoMulterOptions))
  upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: WorkerDocument) {
    if (!file) throw new BadRequestException('Fayl topilmadi');
    return this.photosService.upload(user._id.toString(), file);
  }

  @Get('today')
  getToday(@CurrentUser() user: WorkerDocument) {
    return this.photosService.getToday(user._id.toString());
  }

  @Get('history')
  getHistory(@CurrentUser() user: WorkerDocument, @Query('limit') limit = 10) {
    return this.photosService.findRecentForWorker(user._id.toString(), Number(limit));
  }
}
