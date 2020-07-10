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
  Comment,
  CommentTranslation,
} from '../models';
import {CommentRepository} from '../repositories';

export class CommentCommentTranslationController {
  constructor(
    @repository(CommentRepository) protected commentRepository: CommentRepository,
  ) { }

  @get('/comments/{id}/comment-translations', {
    responses: {
      '200': {
        description: 'Array of Comment has many CommentTranslation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CommentTranslation)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<CommentTranslation>,
  ): Promise<CommentTranslation[]> {
    return this.commentRepository.translations(id).find(filter);
  }

  @post('/comments/{id}/comment-translations', {
    responses: {
      '200': {
        description: 'Comment model instance',
        content: {'application/json': {schema: getModelSchemaRef(CommentTranslation)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Comment.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CommentTranslation, {
            title: 'NewCommentTranslationInComment',
            exclude: ['lang'],
            optional: ['id']
          }),
        },
      },
    }) commentTranslation: Omit<CommentTranslation, 'lang'>,
  ): Promise<CommentTranslation> {
    return this.commentRepository.translations(id).create(commentTranslation);
  }

  @patch('/comments/{id}/comment-translations', {
    responses: {
      '200': {
        description: 'Comment.CommentTranslation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CommentTranslation, {partial: true}),
        },
      },
    })
    commentTranslation: Partial<CommentTranslation>,
    @param.query.object('where', getWhereSchemaFor(CommentTranslation)) where?: Where<CommentTranslation>,
  ): Promise<Count> {
    return this.commentRepository.translations(id).patch(commentTranslation, where);
  }

  @del('/comments/{id}/comment-translations', {
    responses: {
      '200': {
        description: 'Comment.CommentTranslation DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(CommentTranslation)) where?: Where<CommentTranslation>,
  ): Promise<Count> {
    return this.commentRepository.translations(id).delete(where);
  }
}
