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
import {Userone} from '../models';
import {UserRepositoryOne} from '../repositories';

export class UseroneController {
  constructor(
    @repository(UserRepositoryOne)
    public userRepository : UserRepositoryOne,
  ) {}

  @post('/usersone')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(Userone)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Userone, {
            title: 'NewUser',
            
          }),
        },
      },
    })
    user: Userone,
  ): Promise<Userone> {
    return this.userRepository.create(user);
  }

  @get('/usersone/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Userone) where?: Where<Userone>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/usersone')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Userone, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Userone) filter?: Filter<Userone>,
  ): Promise<Userone[]> {
    return this.userRepository.find(filter);
  }

  @patch('/usersone')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Userone, {partial: true}),
        },
      },
    })
    user: Userone,
    @param.where(Userone) where?: Where<Userone>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/usersone/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Userone, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Userone, {exclude: 'where'}) filter?: FilterExcludingWhere<Userone>
  ): Promise<Userone> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/usersone/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Userone, {partial: true}),
        },
      },
    })
    user: Userone,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/usersone/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: Userone,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/usersone/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
  
  @post('/users/webhook')
  async webhook(
    @requestBody({
      content: {
        'application/json': {       // Make sure this matches the POST request type
          'x-parser': 'raw',        // This is the key to skipping parsing
          schema: {type: 'object'},
        },
      },
    })
    user: Buffer,
  ): Promise<any> {
    console.log("webhook called")
    const rawBody = user.toString('utf8');
    console.log(rawBody)
  }
}
