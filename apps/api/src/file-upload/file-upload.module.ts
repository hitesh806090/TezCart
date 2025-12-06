import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';

@Module({
  imports: [],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService], // Export so other modules can use it
})
export class FileUploadModule {}