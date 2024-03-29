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
  Tenant,
} from '../models';
import {UserRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('micado')
export class UserTenantController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/tenant', {
    responses: {
      '200': {
        description: 'User has one Tenant',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tenant),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Tenant>,
  ): Promise<Tenant> {
    return this.userRepository.tenant(id).get(filter);
  }

  @post('/users/{id}/tenant', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Tenant)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tenant, {
            title: 'NewTenantInUser',
            exclude: ['id'],
            optional: ['realm']
          }),
        },
      },
    }) tenant: Omit<Tenant, 'id'>,
  ): Promise<Tenant> {
    return this.userRepository.tenant(id).create(tenant);
  }

  @patch('/users/{id}/tenant', {
    responses: {
      '200': {
        description: 'User.Tenant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tenant, {partial: true}),
        },
      },
    })
    tenant: Partial<Tenant>,
    @param.query.object('where', getWhereSchemaFor(Tenant)) where?: Where<Tenant>,
  ): Promise<Count> {
    return this.userRepository.tenant(id).patch(tenant, where);
  }

  @del('/users/{id}/tenant', {
    responses: {
      '200': {
        description: 'User.Tenant DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Tenant)) where?: Where<Tenant>,
  ): Promise<Count> {
    return this.userRepository.tenant(id).delete(where);
  }
}
