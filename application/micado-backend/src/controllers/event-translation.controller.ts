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
import {EventTranslation} from '../models';
import {EventTranslationRepository} from '../repositories';

export class EventTranslationController {
  constructor(
    @repository(EventTranslationRepository)
    public eventTranslationRepository : EventTranslationRepository,
  ) {}

  @post('/event-translations', {
    responses: {
      '200': {
        description: 'EventTranslation model instance',
        content: {'application/json': {schema: getModelSchemaRef(EventTranslation)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EventTranslation, {
            title: 'NewEventTranslation',
            exclude: ['id'],
          }),
        },
      },
    })
    eventTranslation: Omit<EventTranslation, 'id'>,
  ): Promise<EventTranslation> {
    return this.eventTranslationRepository.create(eventTranslation);
  }

  @get('/event-translations/count', {
    responses: {
      '200': {
        description: 'EventTranslation model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(EventTranslation) where?: Where<EventTranslation>,
  ): Promise<Count> {
    return this.eventTranslationRepository.count(where);
  }

  @get('/event-translations', {
    responses: {
      '200': {
        description: 'Array of EventTranslation model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(EventTranslation, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(EventTranslation) filter?: Filter<EventTranslation>,
  ): Promise<EventTranslation[]> {
    return this.eventTranslationRepository.find(filter);
  }

  @patch('/event-translations', {
    responses: {
      '200': {
        description: 'EventTranslation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EventTranslation, {partial: true}),
        },
      },
    })
    eventTranslation: EventTranslation,
    @param.where(EventTranslation) where?: Where<EventTranslation>,
  ): Promise<Count> {
    return this.eventTranslationRepository.updateAll(eventTranslation, where);
  }

  @get('/event-translations/{id}', {
    responses: {
      '200': {
        description: 'EventTranslation model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(EventTranslation, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(EventTranslation, {exclude: 'where'}) filter?: FilterExcludingWhere<EventTranslation>
  ): Promise<EventTranslation> {
    return this.eventTranslationRepository.findById(id, filter);
  }

  @patch('/event-translations/{id}', {
    responses: {
      '204': {
        description: 'EventTranslation PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EventTranslation, {partial: true}),
        },
      },
    })
    eventTranslation: EventTranslation,
  ): Promise<void> {
    await this.eventTranslationRepository.updateById(id, eventTranslation);
  }

  @put('/event-translations/{id}', {
    responses: {
      '204': {
        description: 'EventTranslation PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() eventTranslation: EventTranslation,
  ): Promise<void> {
    await this.eventTranslationRepository.replaceById(id, eventTranslation);
  }

  @del('/event-translations/{id}', {
    responses: {
      '204': {
        description: 'EventTranslation DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.eventTranslationRepository.deleteById(id);
  }
}
