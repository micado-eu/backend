const createCsvWriter = require('csv-writer').createObjectCsvWriter;
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
import { Event, EventTranslation } from '../models';
import { EventRepository, EventTranslationRepository, LanguagesRepository, SettingsRepository } from '../repositories';
import { inject } from '@loopback/core';
import { FileUploadService, FILE_UPLOAD_SERVICE } from '../services';
import csv from 'csv-parser'
import fs from 'fs';
import {authenticate} from '@loopback/authentication';


export class EventController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadService,
    @repository(EventRepository)
    public eventRepository: EventRepository,
    @repository(EventTranslationRepository)
    public eventTranslationRepository: EventTranslationRepository,
    @repository(LanguagesRepository) 
    public languagesRepository: LanguagesRepository,
    @repository(SettingsRepository) 
    protected settingsRepository: SettingsRepository,
  ) { }

  @post('/events', {
    responses: {
      '200': {
        description: 'Event model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Event) } },
      },
    },
  })
  @authenticate('micado')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, {
            title: 'NewEvent',
            exclude: ['id'],
          }),
        },
      },
    })
    event: Omit<Event, 'id'>,
  ): Promise<Event> {
    return this.eventRepository.create(event);
  }

  @post('/events/unpublished', {
    responses: {
      '200': {
        description: 'Event model instance (unpublished)',
        content: { 'application/json': { schema: getModelSchemaRef(Event) } },
      },
    },
  })
  @authenticate('micado')
  async createUnpublished(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, {
            title: 'NewUnpublishedEvent',
            exclude: ['id'],
            //optional: ['published']
          }),
        },
      },
    })
    event: Omit<Event, 'id'>,
  ): Promise<Event> {
    //event.published = false
    return this.eventRepository.create(event);
  }

  @get('/events/count', {
    responses: {
      '200': {
        description: 'Event model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('micado')
  async count(
    @param.where(Event) where?: Where<Event>,
  ): Promise<Count> {
    return this.eventRepository.count(where);
  }

  @get('/events', {
    responses: {
      '200': {
        description: 'Array of Event model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Event, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  @authenticate('micado')
  async find(
    @param.filter(Event) filter?: Filter<Event>,
  ): Promise<Event[]> {
    return this.eventRepository.find(filter);
  }

  /* @get('/events/published', {
     responses: {
       '200': {
         description: 'Array of Published Event model instances',
         content: {
           'application/json': {
             schema: {
               type: 'array',
               items: getModelSchemaRef(Event, { includeRelations: true }),
             },
           },
         },
       },
     },
   })
   
   async findPublished(
     @param.filter(Event) filter?: Filter<Event>,
   ): Promise<Event[]> {
     return this.eventRepository.findPublished(filter);
   }*/

  @patch('/events', {
    responses: {
      '200': {
        description: 'Event PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  @authenticate('micado')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, { partial: true }),
        },
      },
    })
    event: Event,
    @param.where(Event) where?: Where<Event>,
  ): Promise<Count> {
    return this.eventRepository.updateAll(event, where);
  }

  @del('/events/{id}/category', {
    responses: {
      '204': {
        description: 'Removes category',
      },
    },
  })
  @authenticate('micado')
  async removeCategory(
    @param.path.number('id') id: number
  ): Promise<void> {
    await this.eventRepository.updateById(id, {category: undefined});
  }

  @get('/events/{id}', {
    responses: {
      '200': {
        description: 'Event model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Event, { includeRelations: true }),
          },
        },
      },
    },
  })
  @authenticate('micado')
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Event, { exclude: 'where' }) filter?: FilterExcludingWhere<Event>
  ): Promise<Event> {
    return this.eventRepository.findById(id, filter);
  }

  @patch('/events/{id}', {
    responses: {
      '204': {
        description: 'Event PATCH success',
      },
    },
  })
  @authenticate('micado')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, { partial: true }),
        },
      },
    })
    event: Event,
  ): Promise<void> {
    await this.eventRepository.updateById(id, event);
  }

  @patch('/events/{id}/unpublished', {
    responses: {
      '204': {
        description: 'Event PATCH success (marks event as unpublished in the process)',
      },
    },
  })
  @authenticate('micado')
  async updateByIdUnpublished(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Event, { partial: true }),
        },
      },
    })
    event: Event,
  ): Promise<void> {
    //event.published = false
    await this.eventRepository.updateById(id, event);
  }

  @put('/events/{id}', {
    responses: {
      '204': {
        description: 'Event PUT success',
      },
    },
  })
  @authenticate('micado')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() event: Event,
  ): Promise<void> {
    await this.eventRepository.replaceById(id, event);
  }

  @del('/events/{id}', {
    responses: {
      '204': {
        description: 'Event DELETE success',
      },
    },
  })
  @authenticate('micado')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.eventRepository.deleteById(id);
  }

  @get('/production-events', {
    responses: {
      '200': {
        description: 'Gets published events with topics, user types, and translation (prod)',
      },
    },
  })
  async translatedunion(
    @param.query.string('defaultlang') defaultlang = 'en',
    @param.query.string('currentlang') currentlang = 'en'
  ): Promise<void> {
    return this.eventRepository.dataSource.execute(`
      select
        *,
        (
        select
          to_jsonb(array_agg(it.id_topic))
        from
          event_topic it
        where
          it.id_event = t.id) as topics,
        (
        select
          to_jsonb(array_agg(iu.id_user_types))
        from
          event_user_types iu
        where
          iu.id_event = t.id) as users
      from
        event t
      inner join event_translation_prod tt on
        t.id = tt.id
        and tt.lang = $2
        and (tt.event = '') is false
      union
      select
        *,
        (
        select
          to_jsonb(array_agg(it.id_topic))
        from
          event_topic it
        where
          it.id_event = t.id) as topics,
        (
        select
          to_jsonb(array_agg(iu.id_user_types))
        from
          event_user_types iu
        where
          iu.id_event = t.id) as users
      from
        event t
      inner join event_translation_prod tt on
        t.id = tt.id
        and tt.lang = $1
        and t.id not in (
        select
          t.id
        from
          event t
        inner join event_translation_prod tt on
          t.id = tt.id
          and tt.lang = $2
          and (tt.event = '') is false)
    `, [defaultlang, currentlang]);
  }

  @get('/temp-events', {
    responses: {
      '200': {
        description: 'Gets published events with topics, user types, and translation (temp)',
      },
    },
  })
  async temptranslatedunion(
    @param.query.string('defaultlang') defaultlang = 'en',
    @param.query.string('currentlang') currentlang = 'en'
  ): Promise<void> {
    return this.eventRepository.dataSource.execute(`
      select
        *,
        (
        select
          to_jsonb(array_agg(it.id_topic))
        from
          event_topic it
        where
          it.id_event = t.id) as topics,
        (
        select
          to_jsonb(array_agg(iu.id_user_types))
        from
          event_user_types iu
        where
          iu.id_event = t.id) as users
      from
        event t
      inner join event_translation tt on
        t.id = tt.id
        and tt.lang = $2
        and (tt.event = '') is false
      union
      select
        *,
        (
        select
          to_jsonb(array_agg(it.id_topic))
        from
          event_topic it
        where
          it.id_event = t.id) as topics,
        (
        select
          to_jsonb(array_agg(iu.id_user_types))
        from
          event_user_types iu
        where
          iu.id_event = t.id) as users
      from
        event t
      inner join event_translation tt on
        t.id = tt.id
        and tt.lang = $1
        and t.id not in (
        select
          t.id
        from
          event t
        inner join event_translation tt on
          t.id = tt.id
          and tt.lang = $2
          and (tt.event = '') is false)
    `, [defaultlang, currentlang]);
  }
  @get('/events/to-production', {
    responses: {
      '200': {
        description: 'event GET for the frontend',
      },
    },
  })
  @authenticate('micado')
  async publish (
    @param.query.number('id') id:number,
  ): Promise<void> {
    let languages = await this.languagesRepository.find({ where: { active: true } });
    languages.forEach((lang:any)=>{
      this.eventRepository.dataSource.execute("insert into event_translation_prod(id, lang ,event, description, translation_date) select event_translation.id, event_translation.lang, event_translation.event, event_translation.description, event_translation.translation_date from event_translation  where "+'"translationState"'+" = '1' and id=$1 and lang=$2 and translated=true", [id, lang.lang]);
    })
  }

  @get('/events/export', {
    responses: {
      '200': {
        description: 'export events to CSV',

      },
    },
  })
  @authenticate('micado')
  async export(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.query.number('id') id?: number
  ) {
    let eventElements
    let idString = id !== undefined ? id : 'full'
    if (id !== undefined) {
      console.log("Start export for id: " + id);
      eventElements = await this.eventRepository.find({ where: { id } })
    } else {
      console.log("Start export for full");
      eventElements = await this.eventRepository.find()
    }
    let records: Array<Object> = []
    const promises: Promise<EventTranslation[]>[] = []
    eventElements.forEach((eventElement) => {
      promises.push(new Promise(async (resolve, reject) => {
        const translations = await this.eventRepository.translations(eventElement.id).find()
        translations.forEach((translation) => {
          if (translation.lang && translation.event) {
              records.push({
                id: translation.id,
                lang: translation.lang,
                title: translation.event,
                description: translation.description,
                startDate: eventElement.startDate,
                endDate: eventElement.endDate,
                location: eventElement.location,
                cost: eventElement.cost
              })
          }
        })
        resolve(translations)
      }))
    })
    await Promise.all(promises);
    console.log("Records created")
    const csvWriter = createCsvWriter({
      path: `./.sandbox/event-${idString}.csv`,
      header: [
        { id: 'id', title: 'id' },
        { id: 'lang', title: 'lang' },
        { id: 'title', title: 'title' },
        { id: 'description', title: 'description' },
        { id: 'startDate', title: 'startDate' },
        { id: 'endDate', title: 'endDate' },
        { id: 'location', title: 'location' },
        { id: 'cost', title: 'cost' }
      ]
    })
    console.log(`Writing file in event-${idString}.csv`)
    await csvWriter.writeRecords(records)
    response.download(`.sandbox/event-${idString}.csv`, `event-${idString}.csv`)
    return response
  }

  @post('/events/import', {
    responses: {
      '200': {
        description: 'export glossary to CSV',

      },
    },
  })
  @authenticate('micado')
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
          let uploadedPayload: any = EventController.getFilesAndFields(request)
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
      this.eventRepository.create({
        startDate: value[0].startDate,
        endDate: value[0].endDate,
        location: value[0].location,
        cost: value[0].cost,
      }).then((newEntity) => {
        const promises = []
        for (const translation of value) {
          const toSave = {
            id: newEntity.id,
            lang: translation.lang,
            event: translation.title,
            description: translation.description,
            translationDate: new Date().toISOString()
          }
          if (translation.lang === def_lang) {
            promises.push(this.eventTranslationRepository.create(Object.assign({translated: false}, toSave)))
          }
          promises.push(this.eventTranslationRepository.create(Object.assign({translated: true}, toSave)));
        }
        return Promise.all(promises)
      })
    });
  }
}