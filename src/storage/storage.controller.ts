import { FileTypePathDto } from './dto/upload-file.dto';
import { StorageService } from './storage.service';
import {
  Body,
  Controller,
  Param,
  Redirect,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('storage')
@UseGuards(AuthGuard())
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  getRootFileList(@Req() req) {
    return this.storageService.getRootFileList(req.user.user_id);
  }

  @Get(':path')
  getSubFileList(@Req() req, @Param('path') path: string) {
    return this.storageService.getSubFileList(req.user.user_id, path);
  }
  @Post('upload')
  //@Redirect('')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileInStorage(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() param,
  ) {
    this.storageService.uploadFileInStorage(
      req.user.user_id,
      req.user.username,
      file,
      param.path,
    );
  }
}
