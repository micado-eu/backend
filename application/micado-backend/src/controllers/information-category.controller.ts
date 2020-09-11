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
import {InformationCategory} from '../models';
import {InformationCategoryRepository} from '../repositories';

export class InformationCategoryController {
  constructor(
    @repository(InformationCategoryRepository)
    public informationCategoryRepository : InformationCategoryRepository,
  ) {}

  @post('/information-categories', {
    responses: {
      '200': {
        description: 'InformationCategory model instance',
        content: {'application/json': {schema: getModelSchemaRef(InformationCategory)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InformationCategory, {
            title: 'NewInformationCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    informationCategory: Omit<InformationCategory, 'id'>,
  ): Promise<InformationCategory> {
    return this.informationCategoryRepository.create(informationCategory);
  }

  @get('/information-categories/count', {
    responses: {
      '200': {
        description: 'InformationCategory model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(InformationCategory) where?: Where<InformationCategory>,
  ): Promise<Count> {
    return this.informationCategoryRepository.count(where);
  }

  @get('/information-categories', {
    responses: {
      '200': {
        description: 'Array of InformationCategory model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(InformationCategory, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(InformationCategory) filter?: Filter<InformationCategory>,
  ): Promise<InformationCategory[]> {
    return this.informationCategoryRepository.find(filter);
  }

  @patch('/information-categories', {
    responses: {
      '200': {
        description: 'InformationCategory PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InformationCategory, {partial: true}),
        },
      },
    })
    informationCategory: InformationCategory,
    @param.where(InformationCategory) where?: Where<InformationCategory>,
  ): Promise<Count> {
    return this.informationCategoryRepository.updateAll(informationCategory, where);
  }

  @get('/information-categories/{id}', {
    responses: {
      '200': {
        description: 'InformationCategory model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(InformationCategory, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(InformationCategory, {exclude: 'where'}) filter?: FilterExcludingWhere<InformationCategory>
  ): Promise<InformationCategory> {
    return this.informationCategoryRepository.findById(id, filter);
  }

  @patch('/information-categories/{id}', {
    responses: {
      '204': {
        description: 'InformationCategory PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InformationCategory, {partial: true}),
        },
      },
    })
    informationCategory: InformationCategory,
  ): Promise<void> {
    await this.informationCategoryRepository.updateById(id, informationCategory);
  }

  @put('/information-categories/{id}', {
    responses: {
      '204': {
        description: 'InformationCategory PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() informationCategory: InformationCategory,
  ): Promise<void> {
    await this.informationCategoryRepository.replaceById(id, informationCategory);
  }

  @del('/information-categories/{id}', {
    responses: {
      '204': {
        description: 'InformationCategory DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.informationCategoryRepository.deleteById(id);
  }
}
