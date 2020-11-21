import { bind, /* inject, */ BindingScope, config, Provider, BindingKey, ContextTags } from '@loopback/core';
import multer from 'multer';
/*
 * Fix the service type. Possible options can be:
 * - import {FileUploadService} from 'your-module';
 * - export type FileUploadService = string;
 * - export interface FileUploadService {}
 */
import { RequestHandler } from 'express-serve-static-core';
export type ImageUploadService = RequestHandler;

export const IMAGE_UPLOAD_SERVICE = BindingKey.create<ImageUploadService>(
  'services.ImageUpload',
);

//export const STORAGE_DIRECTORY = BindingKey.create<string>('storage.directory');

@bind({ scope: BindingScope.TRANSIENT, tags: { [ContextTags.KEY]: IMAGE_UPLOAD_SERVICE }, })
export class ImageUploadServiceProvider implements Provider<ImageUploadService> {
  constructor(/* Add @inject to inject parameters */@config() private options: multer.Options = { dest: '/images/' }) { }

  value (): ImageUploadService {
    return multer(this.options).any();
  }
}
