import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  IndividualInterventionPlan,
} from '../models';
import {UserRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('micado')
export class UserIndividualInterventionPlanController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/individual-intervention-plans', {
    responses: {
      '200': {
        description: 'Array of User has many IndividualInterventionPlan',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(IndividualInterventionPlan)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<IndividualInterventionPlan>,
  ): Promise<IndividualInterventionPlan[]> {
    return this.userRepository.interventionPlans(id).find(filter);
  }

  @post('/users/{id}/individual-intervention-plans', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(IndividualInterventionPlan)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IndividualInterventionPlan, {
            title: 'NewIndividualInterventionPlanInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) individualInterventionPlan: Omit<IndividualInterventionPlan, 'id'>,
  ): Promise<IndividualInterventionPlan> {
    return this.userRepository.interventionPlans(id).create(individualInterventionPlan);
  }

  @patch('/users/{id}/individual-intervention-plans', {
    responses: {
      '200': {
        description: 'User.IndividualInterventionPlan PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IndividualInterventionPlan, {partial: true}),
        },
      },
    })
    individualInterventionPlan: Partial<IndividualInterventionPlan>,
    @param.query.object('where', getWhereSchemaFor(IndividualInterventionPlan)) where?: Where<IndividualInterventionPlan>,
  ): Promise<Count> {
    return this.userRepository.interventionPlans(id).patch(individualInterventionPlan, where);
  }

  @del('/users/{id}/individual-intervention-plans', {
    responses: {
      '200': {
        description: 'User.IndividualInterventionPlan DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(IndividualInterventionPlan)) where?: Where<IndividualInterventionPlan>,
  ): Promise<Count> {
    return this.userRepository.interventionPlans(id).delete(where);
  }
}
