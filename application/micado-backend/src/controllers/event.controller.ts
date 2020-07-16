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
import { EventRepository } from '../repositories';

export class EventController {
  constructor(
    @repository(EventRepository)
    public eventRepository: EventRepository,
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
            optional: ['published']
          }),
        },
      },
    })
    event: Omit<Event, 'id'>,
  ): Promise<Event> {
    event.published = false
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

  @get('/events/published', {
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
  }

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
    event.published = false
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
}
