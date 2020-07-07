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
import { UserTypes } from '../models';
import { UserTypesRepository } from '../repositories';

export class UserTypesController {
  constructor(
    @repository(UserTypesRepository)
    public userTypesRepository: UserTypesRepository,
  ) { }

  @post('/user-types', {
    responses: {
      '200': {
        description: 'UserTypes model instance',
        content: { 'application/json': { schema: getModelSchemaRef(UserTypes) } },
      },
    },
  })
  async create (
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTypes, {
            title: 'NewUserTypes',
            exclude: ['id'],
          }),
        },
      },
    })
    userTypes: Omit<UserTypes, 'id'>,
  ): Promise<UserTypes> {
    return this.userTypesRepository.create(userTypes);
  }

  @get('/user-types/count', {
    responses: {
      '200': {
        description: 'UserTypes model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count (
    @param.where(UserTypes) where?: Where<UserTypes>,
  ): Promise<Count> {
    return this.userTypesRepository.count(where);
  }

  @get('/user-types', {
    responses: {
      '200': {
        description: 'Array of UserTypes model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(UserTypes, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find (
    @param.filter(UserTypes) filter?: Filter<UserTypes>,
  ): Promise<UserTypes[]> {
    return this.userTypesRepository.find(filter);
  }

  @patch('/user-types', {
    responses: {
      '200': {
        description: 'UserTypes PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll (
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTypes, { partial: true }),
        },
      },
    })
    userTypes: UserTypes,
    @param.where(UserTypes) where?: Where<UserTypes>,
  ): Promise<Count> {
    return this.userTypesRepository.updateAll(userTypes, where);
  }

  @get('/user-types/{id}', {
    responses: {
      '200': {
        description: 'UserTypes model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserTypes, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById (
    @param.path.number('id') id: number,
    @param.filter(UserTypes, { exclude: 'where' }) filter?: FilterExcludingWhere<UserTypes>
  ): Promise<UserTypes> {
    return this.userTypesRepository.findById(id, filter);
  }

  @patch('/user-types/{id}', {
    responses: {
      '204': {
        description: 'UserTypes PATCH success',
      },
    },
  })
  async updateById (
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTypes, { partial: true }),
        },
      },
    })
    userTypes: UserTypes,
  ): Promise<void> {
    await this.userTypesRepository.updateById(id, userTypes);
  }

  @put('/user-types/{id}', {
    responses: {
      '204': {
        description: 'UserTypes PUT success',
      },
    },
  })
  async replaceById (
    @param.path.number('id') id: number,
    @requestBody() userTypes: UserTypes,
  ): Promise<void> {
    await this.userTypesRepository.replaceById(id, userTypes);
  }

  @del('/user-types/{id}', {
    responses: {
      '204': {
        description: 'UserTypes DELETE success',
      },
    },
  })
  async deleteById (@param.path.number('id') id: number): Promise<void> {
    await this.userTypesRepository.deleteById(id);
  }

  @get('/user-types-migrant', {
    responses: {
      '200': {
        description: 'user-types GET for the frontend',
      },
    },
  })
  async translatedunion (
    @param.query.string('defaultlang') defaultlang = 'en',
    @param.query.string('currentlang') currentlang = 'en'
  ): Promise<void> {
    return this.userTypesRepository.dataSource.execute("select * from user_types t inner join user_types_translation tt on t.id=tt.id and tt.lang='" +
      currentlang + "' union select * from user_types t inner join user_types_translation tt on t.id = tt.id and tt.lang = '" +
      defaultlang +
      "' and t.id not in (select t.id from user_types t inner join user_types_translation tt on t.id = tt.id and tt.lang = '" +
      currentlang + "')");
  }
}
