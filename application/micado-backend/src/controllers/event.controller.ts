import { service } from '@loopback/core';
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
} from '@loopback/rest';
import { Event } from '../models';
import { EventRepository, LanguagesRepository } from '../repositories';

export class EventController {
  constructor(
    @repository(EventRepository)
    public eventRepository: EventRepository,
    @repository(LanguagesRepository) 
    public languagesRepository: LanguagesRepository,
  ) { }

  @post('/events', {
    responses: {
      '200': {
        description: 'Event model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Event) } },
      },
    },
  })
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
  async publish (
    @param.query.number('id') id:number,
  ): Promise<void> {
    let languages = await this.languagesRepository.find({ where: { active: true } });
    languages.forEach((lang:any)=>{
      this.eventRepository.dataSource.execute("insert into event_translation_prod(id, lang ,event, description, translation_date) select event_translation.id, event_translation.lang, event_translation.event, event_translation.description, event_translation.translation_date from event_translation  where "+'"translationState"'+" = '1' and id=$1 and lang=$2 and translated=true", [id, lang.lang]);
    })
  }
}