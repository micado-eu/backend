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
import {Survey} from '../models';
import {SurveyRepository} from '../repositories';

export class SurveyController {
  constructor(
    @repository(SurveyRepository)
    public surveyRepository : SurveyRepository,
  ) {}

  @post('/surveys', {
    responses: {
      '200': {
        description: 'Survey model instance',
        content: {'application/json': {schema: getModelSchemaRef(Survey)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Survey, {
            title: 'NewSurvey',
            exclude: ['id'],
          }),
        },
      },
    })
    survey: Omit<Survey, 'id'>,
  ): Promise<Survey> {
    return this.surveyRepository.create(survey);
  }

  @get('/surveys/count', {
    responses: {
      '200': {
        description: 'Survey model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Survey) where?: Where<Survey>,
  ): Promise<Count> {
    return this.surveyRepository.count(where);
  }

  @get('/surveys', {
    responses: {
      '200': {
        description: 'Array of Survey model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Survey, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Survey) filter?: Filter<Survey>,
  ): Promise<Survey[]> {
    return this.surveyRepository.find(filter);
  }

  @patch('/surveys', {
    responses: {
      '200': {
        description: 'Survey PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Survey, {partial: true}),
        },
      },
    })
    survey: Survey,
    @param.where(Survey) where?: Where<Survey>,
  ): Promise<Count> {
    return this.surveyRepository.updateAll(survey, where);
  }

  @get('/surveys/{id}', {
    responses: {
      '200': {
        description: 'Survey model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Survey, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Survey, {exclude: 'where'}) filter?: FilterExcludingWhere<Survey>
  ): Promise<Survey> {
    return this.surveyRepository.findById(id, filter);
  }

  @patch('/surveys/{id}', {
    responses: {
      '204': {
        description: 'Survey PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Survey, {partial: true}),
        },
      },
    })
    survey: Survey,
  ): Promise<void> {
    await this.surveyRepository.updateById(id, survey);
  }

  @put('/surveys/{id}', {
    responses: {
      '204': {
        description: 'Survey PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() survey: Survey,
  ): Promise<void> {
    await this.surveyRepository.replaceById(id, survey);
  }

  @del('/surveys/{id}', {
    responses: {
      '204': {
        description: 'Survey DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.surveyRepository.deleteById(id);
  }

  @get('/specific-survey', {
    responses: {
      '200': {
        description: 'process GET for the frontend',
      },
    },
  })
  async specificSurvey (
    @param.query.number('destinationApp') destinationApp:number,
  ): Promise<Survey> {
    let surveys = await this.surveyRepository.dataSource.execute('select * from survey where survey.active = true and survey.destination_app =' + destinationApp + ' and survey.expiry_date >= current_date')
    return surveys[0]
  }

}
  
