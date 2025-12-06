import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly baseUrl = 'https://cdn.mock-tezcart.com'; // Mock CDN base URL

  // In a real application, this would interact with S3, Cloudflare R2, etc.
  // For MVP, we'll just simulate storage and return a mock URL.
  async uploadFile(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }

    // Simulate storing the file
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    const mockUrl = `${this.baseUrl}/${uniqueFilename}`;
    this.logger.log(`Simulating file upload: ${file.originalname} -> ${mockUrl}`);

    // In a real scenario, you'd upload 'file.buffer' to S3/R2 here.
    // For example:
    // await s3.upload({ Bucket: 'your-bucket', Key: uniqueFilename, Body: file.buffer }).promise();

    return { url: mockUrl, filename: uniqueFilename };
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<{ url: string; filename: string }[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided.');
    }
    const results: { url: string; filename: string }[] = [];
    for (const file of files) {
      results.push(await this.uploadFile(file));
    }
    return results;
  }
}