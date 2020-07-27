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
import {IndividualInterventionPlan} from '../models';
import {IndividualInterventionPlanRepository} from '../repositories';

export class IndividualInterventionPlanController {
  constructor(
    @repository(IndividualInterventionPlanRepository)
    public individualInterventionPlanRepository : IndividualInterventionPlanRepository,
  ) {}

  @post('/individual-intervention-plans', {
    responses: {
      '200': {
        description: 'IndividualInterventionPlan model instance',
        content: {'application/json': {schema: getModelSchemaRef(IndividualInterventionPlan)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IndividualInterventionPlan, {
            title: 'NewIndividualInterventionPlan',
            exclude: ['id'],
          }),
        },
      },
    })
    individualInterventionPlan: Omit<IndividualInterventionPlan, 'id'>,
  ): Promise<IndividualInterventionPlan> {
    return this.individualInterventionPlanRepository.create(individualInterventionPlan);
  }

  @get('/individual-intervention-plans/count', {
    responses: {
      '200': {
        description: 'IndividualInterventionPlan model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(IndividualInterventionPlan) where?: Where<IndividualInterventionPlan>,
  ): Promise<Count> {
    return this.individualInterventionPlanRepository.count(where);
  }

  @get('/individual-intervention-plans', {
    responses: {
      '200': {
        description: 'Array of IndividualInterventionPlan model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(IndividualInterventionPlan, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(IndividualInterventionPlan) filter?: Filter<IndividualInterventionPlan>,
  ): Promise<IndividualInterventionPlan[]> {
    return this.individualInterventionPlanRepository.find(filter);
  }

  @patch('/individual-intervention-plans', {
    responses: {
      '200': {
        description: 'IndividualInterventionPlan PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IndividualInterventionPlan, {partial: true}),
        },
      },
    })
    individualInterventionPlan: IndividualInterventionPlan,
    @param.where(IndividualInterventionPlan) where?: Where<IndividualInterventionPlan>,
  ): Promise<Count> {
    return this.individualInterventionPlanRepository.updateAll(individualInterventionPlan, where);
  }

  @get('/individual-intervention-plans/{id}', {
    responses: {
      '200': {
        description: 'IndividualInterventionPlan model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(IndividualInterventionPlan, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(IndividualInterventionPlan, {exclude: 'where'}) filter?: FilterExcludingWhere<IndividualInterventionPlan>
  ): Promise<IndividualInterventionPlan> {
    return this.individualInterventionPlanRepository.findById(id, filter);
  }

  @patch('/individual-intervention-plans/{id}', {
    responses: {
      '204': {
        description: 'IndividualInterventionPlan PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IndividualInterventionPlan, {partial: true}),
        },
      },
    })
    individualInterventionPlan: IndividualInterventionPlan,
  ): Promise<void> {
    await this.individualInterventionPlanRepository.updateById(id, individualInterventionPlan);
  }

  @put('/individual-intervention-plans/{id}', {
    responses: {
      '204': {
        description: 'IndividualInterventionPlan PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() individualInterventionPlan: IndividualInterventionPlan,
  ): Promise<void> {
    await this.individualInterventionPlanRepository.replaceById(id, individualInterventionPlan);
  }

  @del('/individual-intervention-plans/{id}', {
    responses: {
      '204': {
        description: 'IndividualInterventionPlan DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.individualInterventionPlanRepository.deleteById(id);
  }
}
