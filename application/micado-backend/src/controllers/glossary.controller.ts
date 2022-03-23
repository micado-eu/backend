const createCsvWriter = require('csv-writer').createObjectCsvWriter;
import { inject, service } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  RestBindings,
  Response,
  Request
} from '@loopback/rest';
import { Glossary, GlossaryTranslation } from '../models';
import { GlossaryRepository, GlossaryTranslationRepository, LanguagesRepository, SettingsRepository } from '../repositories';
import { FileUploadService, FILE_UPLOAD_SERVICE } from '../services';
import csv from 'csv-parser'
import fs from 'fs';

export class GlossaryController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadService,
    @repository(GlossaryRepository)
    public glossaryRepository: GlossaryRepository,
    @repository(GlossaryTranslationRepository)
    public glossaryTranslationRepository: GlossaryTranslationRepository,
    @repository(LanguagesRepository)
    public languagesRepository: LanguagesRepository,
    @repository(SettingsRepository) 
    protected settingsRepository: SettingsRepository,
  ) { }

  @post('/glossaries', {
    responses: {
      '200': {
        description: 'Glossary model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Glossary) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Glossary, {
            title: 'NewGlossary',
            exclude: ['id'],
          }),
        },
      },
    })
    glossary: Omit<Glossary, 'id'>,
  ): Promise<Glossary> {
    return this.glossaryRepository.create(glossary);
  }

  @get('/glossaries/count', {
    responses: {
      '200': {
        description: 'Glossary model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.where(Glossary) where?: Where<Glossary>,
  ): Promise<Count> {
    return this.glossaryRepository.count(where);
  }

  @get('/glossaries', {
    responses: {
      '200': {
        description: 'Array of Glossary model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Glossary, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Glossary) filter?: Filter<Glossary>,
  ): Promise<Glossary[]> {
    return this.glossaryRepository.find(filter);
  }

  /* @get('/glossaries/published', {
     responses: {
       '200': {
         description: 'Array of Published Glossary model instances',
         content: {
           'application/json': {
             schema: {
               type: 'array',
               items: getModelSchemaRef(Glossary, { includeRelations: true }),
             },
           },
         },
       },
     },
   })
   async findPublished(
     @param.filter(Glossary) filter?: Filter<Glossary>,
   ): Promise<Glossary[]> {
     return this.glossaryRepository.findPublished(filter);
   }*/

  @patch('/glossaries', {
    responses: {
      '200': {
        description: 'Glossary PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Glossary, { partial: true }),
        },
      },
    })
    glossary: Glossary,
    @param.where(Glossary) where?: Where<Glossary>,
  ): Promise<Count> {
    return this.glossaryRepository.updateAll(glossary, where);
  }

  @get('/glossaries/{id}', {
    responses: {
      '200': {
        description: 'Glossary model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Glossary, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Glossary, { exclude: 'where' }) filter?: FilterExcludingWhere<Glossary>
  ): Promise<Glossary> {
    return this.glossaryRepository.findById(id, filter);
  }

  @patch('/glossaries/{id}', {
    responses: {
      '204': {
        description: 'Glossary PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Glossary, { partial: true }),
        },
      },
    })
    glossary: Glossary,
  ): Promise<void> {
    await this.glossaryRepository.updateById(id, glossary);
  }

  @put('/glossaries/{id}', {
    responses: {
      '204': {
        description: 'Glossary PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() glossary: Glossary,
  ): Promise<void> {
    await this.glossaryRepository.replaceById(id, glossary);
  }

  @del('/glossaries/{id}', {
    responses: {
      '204': {
        description: 'Glossary DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.glossaryRepository.deleteById(id);
  }

  @get('/production-glossary', {
    responses: {
      '200': {
        description: 'Gets published glossary entries with translation (prod)',
      },
    },
  })
  async translatedunion(
    @param.query.string('defaultlang') defaultlang = 'en',
    @param.query.string('currentlang') currentlang = 'en'
  ): Promise<void> {
    return this.glossaryRepository.dataSource.execute(`
    select
      *
    from
      glossary t
    inner join glossary_translation_prod tt on
      t.id = tt.id
      and tt.lang = $2
      and (tt.title = '') is false
    union
    select
      *
    from
      glossary t
    inner join glossary_translation_prod tt on
      t.id = tt.id
      and tt.lang = $1
      and t.id not in (
      select
        t.id
      from
        glossary t
      inner join glossary_translation_prod tt on
        t.id = tt.id
        and tt.lang = $2
        and (tt.title = '') is false)
    `, [defaultlang, currentlang]);
  }

  @get('/temp-glossary', {
    responses: {
      '200': {
        description: 'Gets published glossary entries with translation (prod)',
      },
    },
  })
  async temptranslatedunion(
    @param.query.string('defaultlang') defaultlang = 'en',
    @param.query.string('currentlang') currentlang = 'en'
  ): Promise<void> {
    return this.glossaryRepository.dataSource.execute(`
    select
      *
    from
      glossary t
    inner join glossary_translation tt on
      t.id = tt.id
      and tt.lang = $2
      and (tt.title = '') is false
    union
    select
      *
    from
      glossary t
    inner join glossary_translation tt on
      t.id = tt.id
      and tt.lang = $1
      and t.id not in (
      select
        t.id
      from
        glossary t
      inner join glossary_translation tt on
        t.id = tt.id
        and tt.lang = $2
        and (tt.title = '') is false)
    `, [defaultlang, currentlang]);
  }
  @get('/glossaries/to-production', {
    responses: {
      '200': {
        description: 'glossary GET for the frontend',
      },
    },
  })
  async publish(
    @param.query.number('id') id: number,
  ): Promise<void> {
    let languages = await this.languagesRepository.find({ where: { active: true } });
    languages.forEach((lang: any) => {
      this.glossaryRepository.dataSource.execute("insert into glossary_translation_prod(id, lang ,title, description, translation_date) select glossary_translation.id, glossary_translation.lang, glossary_translation.title, glossary_translation.description, glossary_translation.translation_date from glossary_translation  where " + '"translationState"' + " = '1' and id=$1 and lang=$2 and translated=true", [id, lang.lang]);
    })
  }

  @get('/glossaries/export', {
    responses: {
      '200': {
        description: 'export glossary to CSV',

      },
    },
  })
  async export(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.number('id') id?: number
  ) {
    let glossaryElements
    let idString = id !== undefined ? id : 'full'
    if (id !== undefined) {
      console.log("Start export for id: " + id);
      glossaryElements = await this.glossaryRepository.find({ where: { id } })
    } else {
      console.log("Start export for full");
      glossaryElements = await this.glossaryRepository.find()
    }
    let records: Array<Object> = []
    const promises: Promise<GlossaryTranslation[]>[] = []
    glossaryElements.forEach((glossaryElement) => {
      promises.push(new Promise(async (resolve, reject) => {
        const translations = await this.glossaryRepository.translations(glossaryElement.id).find()
        translations.forEach((translation) => {
          if (translation.lang && translation.title) {
              records.push({
                id: translation.id,
                lang: translation.lang,
                title: translation.title,
                description: translation.description
              })
          }
        })
        resolve(translations)
      }))
    })
    await Promise.all(promises);
    console.log("Records created")
    const csvWriter = createCsvWriter({
      path: `./.sandbox/glossary-${idString}.csv`,
      header: [
        { id: 'id', title: 'id' },
        { id: 'lang', title: 'lang' },
        { id: 'title', title: 'title' },
        { id: 'description', title: 'description' }
      ]
    })
    console.log(`Writing file in glossary-${idString}.csv`)
    await csvWriter.writeRecords(records)
    response.download(`.sandbox/glossary-${idString}.csv`, `glossary-${idString}.csv`)
    return response
  }

  @post('/glossaries/import', {
    responses: {
      '200': {
        description: 'export glossary to CSV',

      },
    },
  })
  async import(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response
  ) {
    let settings = await this.settingsRepository.find({});
    let def_lang = settings.filter((el: any) => { return el.key === 'default_language' })[0]
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          let uploadedPayload: any = GlossaryController.getFilesAndFields(request)
          const results: any = [];
          let csv_options: any = { trim: true }
          console.log(uploadedPayload.files[0])
          if (uploadedPayload.files[0] === undefined) {
            console.log('No file uploaded')
            resolve({ status: 'No file uploaded' })
            return
          }
          fs.createReadStream('.sandbox' + "/" + uploadedPayload.files[0].originalname)
            .pipe(csv(csv_options))
            .on('data', (data: any) => results.push(data))
            .on('end', () => {
              this.loadData(results, def_lang.value)
              resolve(uploadedPayload);
            });
        }
      });
    });
  }

  /**
   * Get files and fields for the request
   * @param request - Http request
   */
   private static getFilesAndFields(request: Request) {
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

  private loadData(csv: any, def_lang: any) {
    const results = new Map();
    csv.forEach((element: any) => {
      results.has(element.id) ? results.get(element.id).push(element) : results.set(element.id, [element]);
    });
    results.forEach((value: any, key: any) => {
      this.glossaryRepository.create({}).then((newEntity) => {
        const promises = []
        for (const translation of value) {
          const toSave = {
            id: newEntity.id,
            lang: translation.lang,
            title: translation.title,
            description: translation.description,
            translationDate: new Date().toISOString()
          }
          if (translation.lang === def_lang) {
            promises.push(this.glossaryTranslationRepository.create(Object.assign({translated: false}, toSave)))
          }
          promises.push(this.glossaryTranslationRepository.create(Object.assign({translated: true}, toSave)));
        }
        return Promise.all(promises)
      })
    });
  }
}