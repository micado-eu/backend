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
import {StepLink} from '../models';
import {StepLinkRepository} from '../repositories';

export class StepLinkController {
  constructor(
    @repository(StepLinkRepository)
    public stepLinkRepository : StepLinkRepository,
  ) {}

  @post('/step-links', {
    responses: {
      '200': {
        description: 'StepLink model instance',
        content: {'application/json': {schema: getModelSchemaRef(StepLink)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StepLink, {
            title: 'NewStepLink',
            
          }),
        },
      },
    })
    stepLink: StepLink,
  ): Promise<StepLink> {
    return this.stepLinkRepository.create(stepLink);
  }

  @get('/step-links/count', {
    responses: {
      '200': {
        description: 'StepLink model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(StepLink) where?: Where<StepLink>,
  ): Promise<Count> {
    return this.stepLinkRepository.count(where);
  }

  @get('/step-links', {
    responses: {
      '200': {
        description: 'Array of StepLink model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(StepLink, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(StepLink) filter?: Filter<StepLink>,
  ): Promise<StepLink[]> {
    return this.stepLinkRepository.find(filter);
  }

  @patch('/step-links', {
    responses: {
      '200': {
        description: 'StepLink PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StepLink, {partial: true}),
        },
      },
    })
    stepLink: StepLink,
    @param.where(StepLink) where?: Where<StepLink>,
  ): Promise<Count> {
    return this.stepLinkRepository.updateAll(stepLink, where);
  }

  @get('/step-links/{id}', {
    responses: {
      '200': {
        description: 'StepLink model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(StepLink, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(StepLink, {exclude: 'where'}) filter?: FilterExcludingWhere<StepLink>
  ): Promise<StepLink> {
    return this.stepLinkRepository.findById(id, filter);
  }

  @patch('/step-links/{id}', {
    responses: {
      '204': {
        description: 'StepLink PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StepLink, {partial: true}),
        },
      },
    })
    stepLink: StepLink,
  ): Promise<void> {
    await this.stepLinkRepository.updateById(id, stepLink);
  }

  @put('/step-links/{id}', {
    responses: {
      '204': {
        description: 'StepLink PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() stepLink: StepLink,
  ): Promise<void> {
    await this.stepLinkRepository.replaceById(id, stepLink);
  }

  @del('/step-links/{id}', {
    responses: {
      '204': {
        description: 'StepLink DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.stepLinkRepository.deleteById(id);
  }
}
