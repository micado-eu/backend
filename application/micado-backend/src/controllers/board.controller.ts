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
import {Board} from '../models';
import {BoardRepository} from '../repositories';

export class BoardController {
  constructor(
    @repository(BoardRepository)
    public boardRepository : BoardRepository,
  ) {}

  @post('/boards')
  @response(200, {
    description: 'Board model instance',
    content: {'application/json': {schema: getModelSchemaRef(Board)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Board, {
            title: 'NewBoard',
            exclude: ['id'],
          }),
        },
      },
    })
    board: Omit<Board, 'id'>,
  ): Promise<Board> {
    return this.boardRepository.create(board);
  }

  @get('/boards/count')
  @response(200, {
    description: 'Board model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Board) where?: Where<Board>,
  ): Promise<Count> {
    return this.boardRepository.count(where);
  }

  @get('/boards')
  @response(200, {
    description: 'Array of Board model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Board, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Board) filter?: Filter<Board>,
  ): Promise<Board[]> {
    return this.boardRepository.find(filter);
  }

  @patch('/boards')
  @response(200, {
    description: 'Board PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Board, {partial: true}),
        },
      },
    })
    board: Board,
    @param.where(Board) where?: Where<Board>,
  ): Promise<Count> {
    return this.boardRepository.updateAll(board, where);
  }

  @get('/boards/{id}')
  @response(200, {
    description: 'Board model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Board, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Board, {exclude: 'where'}) filter?: FilterExcludingWhere<Board>
  ): Promise<Board> {
    return this.boardRepository.findById(id, filter);
  }

  @patch('/boards/{id}')
  @response(204, {
    description: 'Board PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Board, {partial: true}),
        },
      },
    })
    board: Board,
  ): Promise<void> {
    await this.boardRepository.updateById(id, board);
  }

  @put('/boards/{id}')
  @response(204, {
    description: 'Board PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() board: Board,
  ): Promise<void> {
    await this.boardRepository.replaceById(id, board);
  }

  @del('/boards/{id}')
  @response(204, {
    description: 'Board DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.boardRepository.deleteById(id);
  }
}
