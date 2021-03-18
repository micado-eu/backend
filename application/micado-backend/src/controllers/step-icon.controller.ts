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
import {StepIcon} from '../models';
import {StepIconRepository} from '../repositories';

export class StepIconController {
  constructor(
    @repository(StepIconRepository)
    public stepIconRepository : StepIconRepository,
  ) {}

  @post('/step-icons', {
    responses: {
      '200': {
        description: 'StepIcon model instance',
        content: {'application/json': {schema: getModelSchemaRef(StepIcon)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StepIcon, {
            title: 'NewStepIcon',
            exclude: ['id'],
          }),
        },
      },
    })
    stepIcon: Omit<StepIcon, 'id'>,
  ): Promise<StepIcon> {
    return this.stepIconRepository.create(stepIcon);
  }

  @get('/step-icons/count', {
    responses: {
      '200': {
        description: 'StepIcon model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(StepIcon) where?: Where<StepIcon>,
  ): Promise<Count> {
    return this.stepIconRepository.count(where);
  }

  @get('/step-icons', {
    responses: {
      '200': {
        description: 'Array of StepIcon model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(StepIcon, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(StepIcon) filter?: Filter<StepIcon>,
  ): Promise<StepIcon[]> {
    return this.stepIconRepository.find(filter);
  }

  @patch('/step-icons', {
    responses: {
      '200': {
        description: 'StepIcon PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StepIcon, {partial: true}),
        },
      },
    })
    stepIcon: StepIcon,
    @param.where(StepIcon) where?: Where<StepIcon>,
  ): Promise<Count> {
    return this.stepIconRepository.updateAll(stepIcon, where);
  }

  @get('/step-icons/{id}', {
    responses: {
      '200': {
        description: 'StepIcon model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(StepIcon, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(StepIcon, {exclude: 'where'}) filter?: FilterExcludingWhere<StepIcon>
  ): Promise<StepIcon> {
    return this.stepIconRepository.findById(id, filter);
  }

  @patch('/step-icons/{id}', {
    responses: {
      '204': {
        description: 'StepIcon PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StepIcon, {partial: true}),
        },
      },
    })
    stepIcon: StepIcon,
  ): Promise<void> {
    await this.stepIconRepository.updateById(id, stepIcon);
  }

  @put('/step-icons/{id}', {
    responses: {
      '204': {
        description: 'StepIcon PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() stepIcon: StepIcon,
  ): Promise<void> {
    await this.stepIconRepository.replaceById(id, stepIcon);
  }

  @del('/step-icons/{id}', {
    responses: {
      '204': {
        description: 'StepIcon DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.stepIconRepository.deleteById(id);
  }
}
