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
  put,
  requestBody,
} from '@loopback/rest';
import {
  Process,
  ProcessTranslationProd,
} from '../models';
import {ProcessRepository} from '../repositories';
import {ProcessTranslationProdRepository} from '../repositories';

export class ProcessProcessTranslationProdController {
  constructor(
    @repository(ProcessRepository) protected processRepository: ProcessRepository,
    @repository(ProcessTranslationProdRepository) protected processTranslationProdRepository: ProcessTranslationProdRepository,
  ) { }

  @get('/processes/{id}/process-translation-prods', {
    responses: {
      '200': {
        description: 'Array of Process has many ProcessTranslationProd',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProcessTranslationProd)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ProcessTranslationProd>,
  ): Promise<ProcessTranslationProd[]> {
    return this.processRepository.translations_prod(id).find(filter);
  }

  @post('/processes/{id}/process-translation-prods', {
    responses: {
      '200': {
        description: 'Process model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProcessTranslationProd)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Process.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessTranslationProd, {
            title: 'NewProcessTranslationProdInProcess',
            //exclude: ['id'],
            optional: ['id']
          }),
        },
      },
    }) processTranslationProd: Omit<ProcessTranslationProd, 'id'>,
  ): Promise<ProcessTranslationProd> {
    return this.processRepository.translations_prod(id).create(processTranslationProd);
  }

  @patch('/processes/{id}/process-translation-prods', {
    responses: {
      '200': {
        description: 'Process.ProcessTranslationProd PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessTranslationProd, {partial: true}),
        },
      },
    })
    processTranslationProd: Partial<ProcessTranslationProd>,
    @param.query.object('where', getWhereSchemaFor(ProcessTranslationProd)) where?: Where<ProcessTranslationProd>,
  ): Promise<Count> {
    return this.processRepository.translations_prod(id).patch(processTranslationProd, where);
  }

  @put('/processes/{id}/process-translation-prods', {
    responses: {
      '200': {
        description: 'Process.ProcessTranslationProd PUT success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async put(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessTranslationProd, {partial: true}),
        },
      },
    })
    processTranslationProd: Partial<ProcessTranslationProd>,
    @param.query.object('where', getWhereSchemaFor(ProcessTranslationProd)) where?: Where<ProcessTranslationProd>,
  ): Promise<void> {
    console.log(processTranslationProd);
//    this.processTranslationProdRepository.
    this.processRepository.dataSource.execute("INSERT INTO micadoapp.process_translation_prod(id,lang,process,description,translation_date)  VALUES($1,$2,$3,$4,$5) ON CONFLICT (id,lang) DO UPDATE SET description = EXCLUDED.description, process=EXCLUDED.process, translation_date=EXCLUDED.translation_date;",
    [processTranslationProd.id,processTranslationProd.lang,processTranslationProd.process,processTranslationProd.description,processTranslationProd.translationDate]);
    //translations_prod(id).patch(processTranslationProd, where);
  }

  @del('/processes/{id}/process-translation-prods', {
    responses: {
      '200': {
        description: 'Process.ProcessTranslationProd DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProcessTranslationProd)) where?: Where<ProcessTranslationProd>,
  ): Promise<Count> {
    return this.processRepository.translations_prod(id).delete(where);
  }
}
