import { Controller,Get, Param, Post, UseInterceptors, UploadedFile, Put, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from '../services/cv-parser.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Get()
  async getAllParsedCvs(): Promise<any[]> {
    return this.cvService.findAllParsedCvs();
  }

  @Get(':id') 
  async getParsedCvById(@Param('id') id: string): Promise<any> {
    return this.cvService.findParsedCvById(id);
  }

  @Post('extract')
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Solo se permiten archivos PDF'), false);
        }
      },
    }),
  )
  async uploadCv(@UploadedFile() file: Express.Multer.File) {
    return this.cvService.processCV(file.path);
  }

  @Put(':id')
  async updateParsedCv(
    @Param('id') id: string,
    @Body() updateData: any 
  ): Promise<any> {
    return this.cvService.updateParsedCv(id, updateData);
  }
}