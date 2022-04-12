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
  response,
} from '@loopback/rest';
import {UserEntity} from '../models';
import {UserEntityRepository} from '../repositories';

export class UserEntityController {
  constructor(
    @repository(UserEntityRepository)
    public userEntityRepository : UserEntityRepository,
  ) {}

  @post('/user-entities')
  @response(200, {
    description: 'UserEntity model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserEntity)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserEntity, {
            title: 'NewUserEntity',
            exclude: ['id'],
          }),
        },
      },
    })
    userEntity: Omit<UserEntity, 'id'>,
  ): Promise<UserEntity> {
    return this.userEntityRepository.create(userEntity);
  }

  @get('/user-entities/count')
  @response(200, {
    description: 'UserEntity model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserEntity) where?: Where<UserEntity>,
  ): Promise<Count> {
    return this.userEntityRepository.count(where);
  }

  @get('/user-entities')
  @response(200, {
    description: 'Array of UserEntity model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserEntity, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserEntity) filter?: Filter<UserEntity>,
  ): Promise<UserEntity[]> {
    return this.userEntityRepository.find(filter);
  }

  @patch('/user-entities')
  @response(200, {
    description: 'UserEntity PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserEntity, {partial: true}),
        },
      },
    })
    userEntity: UserEntity,
    @param.where(UserEntity) where?: Where<UserEntity>,
  ): Promise<Count> {
    return this.userEntityRepository.updateAll(userEntity, where);
  }

  @get('/user-entities/{id}')
  @response(200, {
    description: 'UserEntity model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserEntity, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserEntity, {exclude: 'where'}) filter?: FilterExcludingWhere<UserEntity>
  ): Promise<UserEntity> {
    return this.userEntityRepository.findById(id, filter);
  }

  @patch('/user-entities/{id}')
  @response(204, {
    description: 'UserEntity PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserEntity, {partial: true}),
        },
      },
    })
    userEntity: UserEntity,
  ): Promise<void> {
    await this.userEntityRepository.updateById(id, userEntity);
  }

  @put('/user-entities/{id}')
  @response(204, {
    description: 'UserEntity PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userEntity: UserEntity,
  ): Promise<void> {
    await this.userEntityRepository.replaceById(id, userEntity);
  }

  @del('/user-entities/{id}')
  @response(204, {
    description: 'UserEntity DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userEntityRepository.deleteById(id);
  }
}
