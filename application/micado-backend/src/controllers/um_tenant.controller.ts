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
import {Um_Tenant} from '../models';
import {Um_TenantRepository} from '../repositories';

export class Um_TenantController {
  constructor(
    @repository(Um_TenantRepository)
    public tenantRepository : Um_TenantRepository,
  ) {}

  @post('/um_tenants', {
    responses: {
      '200': {
        description: 'Tenant model instance',
        content: {'application/json': {schema: getModelSchemaRef(Um_Tenant)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Um_Tenant, {
            title: 'NewTenant',
            exclude: ['umId'],
          }),
        },
      },
    })
    tenant: Omit<Um_Tenant, 'umId'>,
  ): Promise<Um_Tenant> {
    return this.tenantRepository.create(tenant);
  }

  @get('/um_tenants/count', {
    responses: {
      '200': {
        description: 'Tenant model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Um_Tenant) where?: Where<Um_Tenant>,
  ): Promise<Count> {
    return this.tenantRepository.count(where);
  }

  @get('/um_tenants', {
    responses: {
      '200': {
        description: 'Array of Tenant model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Um_Tenant, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Um_Tenant) filter?: Filter<Um_Tenant>,
  ): Promise<Um_Tenant[]> {
    return this.tenantRepository.find(filter);
  }

  @patch('/um_tenants', {
    responses: {
      '200': {
        description: 'Tenant PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Um_Tenant, {partial: true}),
        },
      },
    })
    tenant: Um_Tenant,
    @param.where(Um_Tenant) where?: Where<Um_Tenant>,
  ): Promise<Count> {
    return this.tenantRepository.updateAll(tenant, where);
  }

  @get('/um_tenants/{id}', {
    responses: {
      '200': {
        description: 'Tenant model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Um_Tenant, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Um_Tenant, {exclude: 'where'}) filter?: FilterExcludingWhere<Um_Tenant>
  ): Promise<Um_Tenant> {
    return this.tenantRepository.findById(id, filter);
  }

  @patch('/um_tenants/{id}', {
    responses: {
      '204': {
        description: 'Tenant PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Um_Tenant, {partial: true}),
        },
      },
    })
    tenant: Um_Tenant,
  ): Promise<void> {
    await this.tenantRepository.updateById(id, tenant);
  }

  @put('/um_tenants/{id}', {
    responses: {
      '204': {
        description: 'Tenant PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tenant: Um_Tenant,
  ): Promise<void> {
    await this.tenantRepository.replaceById(id, tenant);
  }

  @del('/um_tenants/{id}', {
    responses: {
      '204': {
        description: 'Tenant DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tenantRepository.deleteById(id);
  }
}
