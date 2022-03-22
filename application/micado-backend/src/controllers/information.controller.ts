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
import { Information, InformationTranslation } from '../models';
import { InformationRepository, InformationTranslationRepository, LanguagesRepository, SettingsRepository } from '../repositories';
import { FileUploadService, FILE_UPLOAD_SERVICE } from '../services';
import csv from 'csv-parser'
import fs from 'fs';

export class InformationController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadService,
    @repository(InformationRepository)
    public informationRepository: InformationRepository,
    @repository(InformationTranslationRepository)
    public informationTranslationRepository: InformationTranslationRepository,
    @repository(LanguagesRepository) 
    public languagesRepository: LanguagesRepository,
    @repository(SettingsRepository) 
    protected settingsRepository: SettingsRepository,
  ) { }

  @post('/information', {
    responses: {
      '200': {
        description: 'Information model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Information) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Information, {
            title: 'NewInformation',
            exclude: ['id'],
          }),
        },
      },
    })
    information: Omit<Information, 'id'>,
  ): Promise<Information> {
    return this.informationRepository.create(information);
  }

  @post('/information/unpublished', {
    responses: {
      '200': {
        description: 'Information model instance (unpublished)',
        content: { 'application/json': { schema: getModelSchemaRef(Information) } },
      },
    },
  })
  async createUnpublished(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Information, {
            title: 'NewUnpublishedInformation',
            exclude: ['id'],
            //optional: ['published']
          }),
        },
      },
    })
    information: Omit<Information, 'id'>,
  ): Promise<Information> {
    //information.published = false
    return this.informationRepository.create(information);
  }

  @get('/information/count', {
    responses: {
      '200': {
        description: 'Information model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.where(Information) where?: Where<Information>,
  ): Promise<Count> {
    return this.informationRepository.count(where);
  }

  @get('/information', {
    responses: {
      '200': {
        description: 'Array of Information model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Information, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Information) filter?: Filter<Information>,
  ): Promise<Information[]> {
    return this.informationRepository.find(filter);
  }

  /*@get('/information/published', {
    responses: {
      '200': {
        description: 'Array of Published Information model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Information, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async findPublished(
    @param.filter(Information) filter?: Filter<Information>,
  ): Promise<Information[]> {
    return this.informationRepository.findPublished(filter);
  }*/

  @patch('/information', {
    responses: {
      '200': {
        description: 'Information PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Information, { partial: true }),
        },
      },
    })
    information: Information,
    @param.where(Information) where?: Where<Information>,
  ): Promise<Count> {
    return this.informationRepository.updateAll(information, where);
  }

  @get('/information/{id}', {
    responses: {
      '200': {
        description: 'Information model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Information, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Information, { exclude: 'where' }) filter?: FilterExcludingWhere<Information>
  ): Promise<Information> {
    return this.informationRepository.findById(id, filter);
  }

  @patch('/information/{id}', {
    responses: {
      '204': {
        description: 'Information PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Information, { partial: true }),
        },
      },
    })
    information: Information,
  ): Promise<void> {
    await this.informationRepository.updateById(id, information);
  }

  @patch('/information/{id}/unpublished', {
    responses: {
      '204': {
        description: 'Information PATCH success (marks information as unpublished in the process)',
      },
    },
  })
  async updateByIdUnpublished(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Information, { partial: true }),
        },
      },
    })
    information: Information,
  ): Promise<void> {
    //information.published = false
    await this.informationRepository.updateById(id, information);
  }

  @del('/information/{id}/category', {
    responses: {
      '204': {
        description: 'Removes category',
      },
    },
  })
  async removeCategory(
    @param.path.number('id') id: number
  ): Promise<void> {
    await this.informationRepository.updateById(id, {category: undefined});
  }

  @put('/information/{id}', {
    responses: {
      '204': {
        description: 'Information PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() information: Information,
  ): Promise<void> {
    await this.informationRepository.replaceById(id, information);
  }

  @del('/information/{id}', {
    responses: {
      '204': {
        description: 'Information DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.informationRepository.deleteById(id);
  }

  @get('/production-information', {
    responses: {
      '200': {
        description: 'Gets published information with topics, user types, and translation (prod)',
      },
    },
  })
  async translatedunion(
    @param.query.string('defaultlang') defaultlang = 'en',
    @param.query.string('currentlang') currentlang = 'en'
  ): Promise<void> {
    return this.informationRepository.dataSource.execute(`
      select
        *,
        (
        select
          to_jsonb(array_agg(it.id_topic))
        from
          information_topic it
        where
          it.id_information = t.id) as topics,
        (
        select
          to_jsonb(array_agg(iu.id_user_types))
        from
          information_user_types iu
        where
          iu.id_information = t.id) as users
      from
        information t
      inner join information_translation_prod tt on
        t.id = tt.id
        and tt.lang = $2
        and (tt.information = '') is false
      union
      select
        *,
        (
        select
          to_jsonb(array_agg(it.id_topic))
        from
          information_topic it
        where
          it.id_information = t.id) as topics,
        (
        select
          to_jsonb(array_agg(iu.id_user_types))
        from
          information_user_types iu
        where
          iu.id_information = t.id) as users
      from
        information t
      inner join information_translation_prod tt on
        t.id = tt.id
        and tt.lang = $1
        and t.id not in (
        select
          t.id
        from
          information t
        inner join information_translation_prod tt on
          t.id = tt.id
          and tt.lang = $2
          and (tt.information = '') is false)
    `, [defaultlang, currentlang]);

    
  }
  @get('/temp-information', {
    responses: {
      '200': {
        description: 'Gets published information with topics, user types, and translation (temp)',
      },
    },
  })
  async temptranslatedunion(
    @param.query.string('defaultlang') defaultlang = 'en',
    @param.query.string('currentlang') currentlang = 'en'
  ): Promise<void> {
    return this.informationRepository.dataSource.execute(`
      select
        *,
        (
        select
          to_jsonb(array_agg(it.id_topic))
        from
          information_topic it
        where
          it.id_information = t.id) as topics,
        (
        select
          to_jsonb(array_agg(iu.id_user_types))
        from
          information_user_types iu
        where
          iu.id_information = t.id) as users
      from
        information t
      inner join information_translation tt on
        t.id = tt.id
        and tt.lang = $2
        and (tt.information = '') is false
      union
      select
        *,
        (
        select
          to_jsonb(array_agg(it.id_topic))
        from
          information_topic it
        where
          it.id_information = t.id) as topics,
        (
        select
          to_jsonb(array_agg(iu.id_user_types))
        from
          information_user_types iu
        where
          iu.id_information = t.id) as users
      from
        information t
      inner join information_translation tt on
        t.id = tt.id
        and tt.lang = $1
        and t.id not in (
        select
          t.id
        from
          information t
        inner join information_translation tt on
          t.id = tt.id
          and tt.lang = $2
          and (tt.information = '') is false)
    `, [defaultlang, currentlang]);
  }
  @get('/information/to-production', {
    responses: {
      '200': {
        description: 'information GET for the frontend',
      },
    },
  })
  async publish (
    @param.query.number('id') id:number,
  ): Promise<void> {
    let languages = await this.languagesRepository.find({ where: { active: true } });
    languages.forEach((lang:any)=>{
      this.informationRepository.dataSource.execute("insert into information_translation_prod(id, lang ,information, description, translation_date) select information_translation.id, information_translation.lang, information_translation.information, information_translation.description, information_translation.translation_date from information_translation  where "+'"translationState"'+" = '1' and id=$1 and lang=$2 and translated=true", [id, lang.lang]);
    })
  }

  @get('/information/export', {
    responses: {
      '200': {
        description: 'export information to CSV',

      },
    },
  })
  async export(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.number('id') id?: number
  ) {
    let informationElements
    let idString = id !== undefined ? id : 'full'
    if (id !== undefined) {
      console.log("Start export for id: " + id);
      informationElements = await this.informationRepository.find({ where: { id } })
    } else {
      console.log("Start export for full");
      informationElements = await this.informationRepository.find()
    }
    let records: Array<Object> = []
    const promises: Promise<InformationTranslation[]>[] = []
    informationElements.forEach((informationElement) => {
      promises.push(new Promise(async (resolve, reject) => {
        const translations = await this.informationRepository.translations(informationElement.id).find()
        translations.forEach((translation) => {
          if (translation.lang && translation.information) {
              records.push({
                id: translation.id,
                lang: translation.lang,
                title: translation.information,
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
      path: `./.sandbox/information-${idString}.csv`,
      header: [
        { id: 'id', title: 'id' },
        { id: 'lang', title: 'lang' },
        { id: 'title', title: 'title' },
        { id: 'description', title: 'description' }
      ]
    })
    console.log(`Writing file in information-${idString}.csv`)
    await csvWriter.writeRecords(records)
    response.download(`.sandbox/information-${idString}.csv`, `information-${idString}.csv`)
    return response
  }

  @post('/information/import', {
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
          let uploadedPayload: any = InformationController.getFilesAndFields(request)
          const results: any = [];
          let csv_options: any = { trim: true }
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
      this.informationRepository.create({}).then((newEntity) => {
        const promises = []
        for (const translation of value) {
          const toSave = {
            id: newEntity.id,
            lang: translation.lang,
            information: translation.title,
            description: translation.description,
            translationDate: new Date().toISOString()
          }
          if (translation.lang === def_lang) {
            promises.push(this.informationTranslationRepository.create(Object.assign({translated: false}, toSave)))
          }
          promises.push(this.informationTranslationRepository.create(Object.assign({translated: true}, toSave)));
        }
        return Promise.all(promises)
      })
    });
  }
}
