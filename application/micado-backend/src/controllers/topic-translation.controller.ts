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
import {TopicTranslation} from '../models';
import {TopicTranslationRepoRepository} from '../repositories';

export class TopicTranslationController {
  constructor(
    @repository(TopicTranslationRepoRepository)
    public topicTranslationRepoRepository : TopicTranslationRepoRepository,
  ) {}

  @post('/topic-translations', {
    responses: {
      '200': {
        description: 'TopicTranslation model instance',
        content: {'application/json': {schema: getModelSchemaRef(TopicTranslation)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TopicTranslation, {
            title: 'NewTopicTranslation',
            
          }),
        },
      },
    })
    topicTranslation: TopicTranslation,
  ): Promise<TopicTranslation> {
    return this.topicTranslationRepoRepository.create(topicTranslation);
  }

  @get('/topic-translations/count', {
    responses: {
      '200': {
        description: 'TopicTranslation model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(TopicTranslation) where?: Where<TopicTranslation>,
  ): Promise<Count> {
    return this.topicTranslationRepoRepository.count(where);
  }

  @get('/topic-translations', {
    responses: {
      '200': {
        description: 'Array of TopicTranslation model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TopicTranslation, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(TopicTranslation) filter?: Filter<TopicTranslation>,
  ): Promise<TopicTranslation[]> {
    return this.topicTranslationRepoRepository.find(filter);
  }

  @patch('/topic-translations', {
    responses: {
      '200': {
        description: 'TopicTranslation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TopicTranslation, {partial: true}),
        },
      },
    })
    topicTranslation: TopicTranslation,
    @param.where(TopicTranslation) where?: Where<TopicTranslation>,
  ): Promise<Count> {
    return this.topicTranslationRepoRepository.updateAll(topicTranslation, where);
  }

  @get('/topic-translations/{id}', {
    responses: {
      '200': {
        description: 'TopicTranslation model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TopicTranslation, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TopicTranslation, {exclude: 'where'}) filter?: FilterExcludingWhere<TopicTranslation>
  ): Promise<TopicTranslation> {
    return this.topicTranslationRepoRepository.findById(id, filter);
  }

  @patch('/topic-translations/{id}', {
    responses: {
      '204': {
        description: 'TopicTranslation PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TopicTranslation, {partial: true}),
        },
      },
    })
    topicTranslation: TopicTranslation,
  ): Promise<void> {
    await this.topicTranslationRepoRepository.updateById(id, topicTranslation);
  }

  @put('/topic-translations/{id}', {
    responses: {
      '204': {
        description: 'TopicTranslation PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() topicTranslation: TopicTranslation,
  ): Promise<void> {
    await this.topicTranslationRepoRepository.replaceById(id, topicTranslation);
  }

  @del('/topic-translations/{id}', {
    responses: {
      '204': {
        description: 'TopicTranslation DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.topicTranslationRepoRepository.deleteById(id);
  }
}
