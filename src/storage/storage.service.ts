import { UploadService } from './../upload/upload.service';
import { UserRepository } from './../auth/auth.repository';
import { FileTypePathDto } from './dto/upload-file.dto';
import { StorageRepository } from './storage.repository';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class StorageService {
  constructor(
    private storageRepository: StorageRepository,
    private userRepository: UserRepository,
    private uploadService: UploadService,
  ) {}

  async getRootFileList(uId: number) {
    return await this.storageRepository.findBy({ user_id: uId, path: '/' });
  }

  async getSubFileList(uId: number, encodedPath: string) {
    const path = Buffer.from(encodedPath).toString('utf8');
    return await this.storageRepository.findBy({ user_id: uId, path });
  }

  async uploadFileInStorage(
    uId: number,
    file: Express.Multer.File,
    path: string,
  ) {
    const random = Math.floor(Math.random() * (999999 - 100001) + 100000);
    const fileName = `${Date.now()}-${random}`;
    const hash = await this.uploadService.uploadFile(file);
    const userName = await (
      await this.userRepository.findOneBy({ id: uId })
    ).username;

    this.storageRepository.uploadFile(uId, fileName, file, path, hash);
    fs.writeFile(`files/${userName}/${fileName}`, file.buffer, (err) => {
      if (err) throw err;
    });
  }
}
