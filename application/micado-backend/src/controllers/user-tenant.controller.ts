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
  Um_Tenant,
} from '../models';
import {UserRepository} from '../repositories';

export class UserTenantController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/um_tenant', {
    responses: {
      '200': {
        description: 'User has one Tenant',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Um_Tenant),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Um_Tenant>,
  ): Promise<Um_Tenant> {
    return this.userRepository.tenant(id).get(filter);
  }

  @post('/users/{id}/um_tenant', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Um_Tenant)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.umId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Um_Tenant, {
            title: 'NewTenantInUser',
            exclude: ['umId'],
            optional: ['umId']
          }),
        },
      },
    }) tenant: Omit<Um_Tenant, 'umId'>,
  ): Promise<Um_Tenant> {
    return this.userRepository.tenant(id).create(tenant);
  }

  @patch('/users/{id}/um_tenant', {
    responses: {
      '200': {
        description: 'User.Tenant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Um_Tenant, {partial: true}),
        },
      },
    })
    tenant: Partial<Um_Tenant>,
    @param.query.object('where', getWhereSchemaFor(Um_Tenant)) where?: Where<Um_Tenant>,
  ): Promise<Count> {
    return this.userRepository.tenant(id).patch(tenant, where);
  }

  @del('/users/{id}/um_tenant', {
    responses: {
      '200': {
        description: 'User.Tenant DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Um_Tenant)) where?: Where<Um_Tenant>,
  ): Promise<Count> {
    return this.userRepository.tenant(id).delete(where);
  }
}
