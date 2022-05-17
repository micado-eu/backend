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
  UserPictures,
} from '../models';
import {UserRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('micado')
export class UserUserPicturesController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/user-pictures', {
    responses: {
      '200': {
        description: 'User has one UserPictures',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserPictures),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserPictures>,
  ): Promise<UserPictures> {
    return this.userRepository.userPicture(id).get(filter);
  }

  @post('/users/{id}/user-pictures', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserPictures)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserPictures, {
            title: 'NewUserPicturesInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userPictures: Omit<UserPictures, 'id'>,
  ): Promise<UserPictures> {
    return this.userRepository.userPicture(id).create(userPictures);
  }

  @patch('/users/{id}/user-pictures', {
    responses: {
      '200': {
        description: 'User.UserPictures PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserPictures, {partial: true}),
        },
      },
    })
    userPictures: Partial<UserPictures>,
    @param.query.object('where', getWhereSchemaFor(UserPictures)) where?: Where<UserPictures>,
  ): Promise<Count> {
    return this.userRepository.userPicture(id).patch(userPictures, where);
  }

  @del('/users/{id}/user-pictures', {
    responses: {
      '200': {
        description: 'User.UserPictures DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserPictures)) where?: Where<UserPictures>,
  ): Promise<Count> {
    return this.userRepository.userPicture(id).delete(where);
  }
}
