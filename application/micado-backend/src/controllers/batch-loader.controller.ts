// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
//import { inject } from '@loopback/core';
import {
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import { FileUploadService, FileUploadServiceProvider, FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY } from '../services/file-upload-service.service'
import csv from 'csv-parser'
import fs from 'fs';
import path from 'path';


export class BatchLoaderController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadService,
  ) { }

  @post('/files', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Files and fields',
      },
    },
  })
  async fileUpload (
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          let uploadedPayload: any = BatchLoaderController.getFilesAndFields(request)
          console.log(uploadedPayload)
          const results: any = [];
          let csv_options: any = { trim: true }
          fs.createReadStream('/code/micado-backend/.sandbox' + "/" + uploadedPayload.files[0].originalname)
            .pipe(csv(csv_options))
            .on('data', (data) => results.push(data))
            .on('end', () => {
              console.log(results);
              // [
              //   { NAME: 'Daffy Duck', AGE: '24' },
              //   { NAME: 'Bugs Bunny', AGE: '22' }
              // ]
            });
          resolve(uploadedPayload);
        }
      });
    });
  }

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private static getFilesAndFields (request: Request) {
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
    });
    let files: object[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    return { files, fields: request.body };
  }
}
