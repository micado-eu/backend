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
import {InterventionTypes} from '../models';
import {InterventionTypesRepository} from '../repositories';

export class InterventionTypesController {
  constructor(
    @repository(InterventionTypesRepository)
    public interventionTypesRepository : InterventionTypesRepository,
  ) {}

  @post('/intervention-types', {
    responses: {
      '200': {
        description: 'InterventionTypes model instance',
        content: {'application/json': {schema: getModelSchemaRef(InterventionTypes)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InterventionTypes, {
            title: 'NewInterventionTypes',
            exclude: ['id'],
          }),
        },
      },
    })
    interventionTypes: Omit<InterventionTypes, 'id'>,
  ): Promise<InterventionTypes> {
    return this.interventionTypesRepository.create(interventionTypes);
  }

  @get('/intervention-types/count', {
    responses: {
      '200': {
        description: 'InterventionTypes model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(InterventionTypes) where?: Where<InterventionTypes>,
  ): Promise<Count> {
    return this.interventionTypesRepository.count(where);
  }

  @get('/intervention-types', {
    responses: {
      '200': {
        description: 'Array of InterventionTypes model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(InterventionTypes, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(InterventionTypes) filter?: Filter<InterventionTypes>,
  ): Promise<InterventionTypes[]> {
    return this.interventionTypesRepository.find(filter);
  }

  @patch('/intervention-types', {
    responses: {
      '200': {
        description: 'InterventionTypes PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InterventionTypes, {partial: true}),
        },
      },
    })
    interventionTypes: InterventionTypes,
    @param.where(InterventionTypes) where?: Where<InterventionTypes>,
  ): Promise<Count> {
    return this.interventionTypesRepository.updateAll(interventionTypes, where);
  }

  @get('/intervention-types/{id}', {
    responses: {
      '200': {
        description: 'InterventionTypes model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InterventionTypes, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(InterventionTypes, {exclude: 'where'}) filter?: FilterExcludingWhere<InterventionTypes>
  ): Promise<InterventionTypes> {
    return this.interventionTypesRepository.findById(id, filter);
  }

  @patch('/intervention-types/{id}', {
    responses: {
      '204': {
        description: 'InterventionTypes PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InterventionTypes, {partial: true}),
        },
      },
    })
    interventionTypes: InterventionTypes,
  ): Promise<void> {
    await this.interventionTypesRepository.updateById(id, interventionTypes);
  }

  @put('/intervention-types/{id}', {
    responses: {
      '204': {
        description: 'InterventionTypes PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() interventionTypes: InterventionTypes,
  ): Promise<void> {
    await this.interventionTypesRepository.replaceById(id, interventionTypes);
  }

  @del('/intervention-types/{id}', {
    responses: {
      '204': {
        description: 'InterventionTypes DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.interventionTypesRepository.deleteById(id);
  }
}
