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
import { Tenant } from '../models';
import { TenantRepository } from '../repositories';

export class TenantController {
  constructor(
    @repository(TenantRepository)
    public tenantRepository: TenantRepository,
  ) { }

  @post('/tenants', {
    responses: {
      '200': {
        description: 'Tenant model instance',
        //        content: { 'application/json': { schema: getModelSchemaRef(Tenant) } },
      },
    },
  })
  async create (
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tenant, {
            title: 'NewTenant',
            exclude: ['id'],
          }),
        },
      },
    })
    tenant: Tenant,
  ): Promise<Tenant> {
    return this.tenantRepository.create(tenant);
  }

  @get('/tenants/count', {
    responses: {
      '200': {
        description: 'Tenant model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count (
    @param.where(Tenant) where?: Where<Tenant>,
  ): Promise<Count> {
    return this.tenantRepository.count(where);
  }

  @get('/tenants', {
    responses: {
      '200': {
        description: 'Array of Tenant model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Tenant, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find (
    @param.filter(Tenant) filter?: Filter<Tenant>,
  ): Promise<Tenant[]> {
    return this.tenantRepository.find(filter);
  }

  @patch('/tenants', {
    responses: {
      '200': {
        description: 'Tenant PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll (
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tenant, { partial: true }),
        },
      },
    })
    tenant: Tenant,
    @param.where(Tenant) where?: Where<Tenant>,
  ): Promise<Count> {
    return this.tenantRepository.updateAll(tenant, where);
  }

  @get('/tenants/{id}', {
    responses: {
      '200': {
        description: 'Tenant model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tenant, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById (
    @param.path.number('id') id: number,
    @param.filter(Tenant, { exclude: 'where' }) filter?: FilterExcludingWhere<Tenant>
  ): Promise<Tenant> {
    return this.tenantRepository.findById(id, filter);
  }

  @patch('/tenants/{id}', {
    responses: {
      '204': {
        description: 'Tenant PATCH success',
      },
    },
  })
  async updateById (
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tenant, { partial: true }),
        },
      },
    })
    tenant: Tenant,
  ): Promise<void> {
    await this.tenantRepository.updateById(id, tenant);
  }

  @put('/tenants/{id}', {
    responses: {
      '204': {
        description: 'Tenant PUT success',
      },
    },
  })
  async replaceById (
    @param.path.number('id') id: number,
    @requestBody() tenant: Tenant,
  ): Promise<void> {
    await this.tenantRepository.replaceById(id, tenant);
  }

  @del('/tenants/{id}', {
    responses: {
      '204': {
        description: 'Tenant DELETE success',
      },
    },
  })
  async deleteById (@param.path.number('id') id: number): Promise<void> {
    await this.tenantRepository.deleteById(id);
  }
}
