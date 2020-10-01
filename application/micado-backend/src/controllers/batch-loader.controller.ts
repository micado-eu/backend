// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
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

import { SettingsRepository } from '../repositories';
import { GlossaryTranslationRepository } from '../repositories';
import { GlossaryRepository } from '../repositories';
import { LanguagesRepository } from '../repositories';


export class BatchLoaderController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadService,
    @repository(SettingsRepository) protected settingsRepository: SettingsRepository,
    @repository(GlossaryTranslationRepository) protected glossaryTranslationRepository: GlossaryTranslationRepository,
    @repository(GlossaryRepository) protected glossaryRepository: GlossaryRepository,
    @repository(LanguagesRepository) protected languagesRepository: LanguagesRepository,

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
    let settings = await this.settingsRepository.find({});
    //   let lang_filter = { where: { active: true } }
    let languages = await this.languagesRepository.find({ where: { active: true } });

    console.log(settings)
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          let def_lang = settings.filter((el: any) => { return el.key === 'default_language' })[0]

          console.log(def_lang)

          let uploadedPayload: any = BatchLoaderController.getFilesAndFields(request)
          console.log(uploadedPayload)
          const results: any = [];
          let csv_options: any = { trim: true }
          fs.createReadStream('/code/micado-backend/.sandbox' + "/" + uploadedPayload.files[0].originalname)
            .pipe(csv(csv_options))
            .on('data', (data: any) => results.push(data))
            .on('end', () => {
              console.log(results);
              this.loadData('glossary', results, def_lang.value, languages)
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

  private loadData (entity: string, csv: any, def_lang: any, act_lang: any) {
    console.log("in load data")
    console.log(csv)
    switch (entity) {
      case "glossary":
        csv.forEach((element: any) => {
          this.glossaryRepository.create({})
            .then(newEntity => {
              console.log(newEntity)

              console.log("ready to add text")
              console.log(def_lang)
              element.lang = def_lang
              element.id = newEntity.id
              console.log(element)
              act_lang.forEach((alang: any) => {
                if (alang.lang === def_lang) {
                  this.glossaryTranslationRepository.create(element)
                    .then(newTranslation => {
                      console.log(newTranslation)
                    })
                } else {
                  let empty = { lang: alang.lang, id: newEntity.id }
                  this.glossaryTranslationRepository.create(empty)
                    .then(newTranslation => {
                      console.log(newTranslation)
                    })
                }
              });
            })

        });
        break;
      case "Orange":
        break;
      case "Apple":
        break;
      default:
        console.log("There is a problem in the entity you sent")
    }

  }
}