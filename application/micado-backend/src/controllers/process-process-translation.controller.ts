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
  ProcessTranslation,
} from '../models';
import { ProcessRepository } from '../repositories';

export class ProcessProcessTranslationController {
  constructor(
    @repository(ProcessRepository) protected processRepository: ProcessRepository,
  ) { }

  @get('/processes/{id}/process-translations', {
    responses: {
      '200': {
        description: 'Array of Process has many ProcessTranslation',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(ProcessTranslation) },
          },
        },
      },
    },
  })
  async find (
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ProcessTranslation>,
  ): Promise<ProcessTranslation[]> {
    return this.processRepository.translations(id).find(filter);
  }

  @post('/processes/{id}/process-translations', {
    responses: {
      '200': {
        description: 'Process model instance',
        content: { 'application/json': { schema: getModelSchemaRef(ProcessTranslation) } },
      },
    },
  })
  async create (
    @param.path.number('id') id: typeof Process.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessTranslation, {
            title: 'NewProcessTranslationInProcess',
            //           exclude: ['id'],
            optional: ['id']
          }),
        },
      },
    }) processTranslation: ProcessTranslation,
    //   }) processTranslation: Omit < ProcessTranslation, 'id' >,
  ): Promise<ProcessTranslation> {
    return this.processRepository.translations(id).create(processTranslation);
  }

  @patch('/processes/{id}/process-translations', {
    responses: {
      '200': {
        description: 'Process.ProcessTranslation PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch (
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessTranslation, { partial: true }),
        },
      },
    })
    processTranslation: Partial<ProcessTranslation>,
    @param.query.object('where', getWhereSchemaFor(ProcessTranslation)) where?: Where<ProcessTranslation>,
  ): Promise<Count> {
    return this.processRepository.translations(id).patch(processTranslation, where);
  }

  @del('/processes/{id}/process-translations', {
    responses: {
      '200': {
        description: 'Process.ProcessTranslation DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete (
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProcessTranslation)) where?: Where<ProcessTranslation>,
  ): Promise<Count> {
    return this.processRepository.translations(id).delete(where);
  }



  @put('/processes/{id}/process-translations', {
    responses: {
      '200': {
        description: 'Process.ProcessTranslation PUT success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async put(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessTranslation, {partial: true}),
        },
      },
    })
    processTranslation: Partial<ProcessTranslation>,
    @param.query.object('where', getWhereSchemaFor(ProcessTranslation)) where?: Where<ProcessTranslation>,
  ): Promise<void> {
    console.log(processTranslation);
//    this.processTranslationProdRepository.
    this.processRepository.dataSource.execute("INSERT INTO process_translation(id,lang,process,description,translation_date,published,"+'"translationState"'+") VALUES($1,$2,$3,$4,NOW(),true,1) ON CONFLICT (id,lang) DO UPDATE SET description = EXCLUDED.description, process=EXCLUDED.process, translation_date= EXCLUDED.translation_date where NOT(process_translation.process=EXCLUDED.process and process_translation.description=EXCLUDED.description);",
    [processTranslation.id,processTranslation.lang,processTranslation.process,processTranslation.description]);
    //translations_prod(id).patch(processTranslationProd, where);
  }

}


/*
 INSERT INTO micadoapp.process_translation_prod(id,lang,process,description,translation_date)
VALUES(92,'es','test_it5','test1',null) 
ON CONFLICT (id,lang) 
DO
   UPDATE SET description = EXCLUDED.description, process=EXCLUDED.process, translation_date= NOW() where NOT(micadoapp.process_translation_prod.process=EXCLUDED.process and micadoapp.process_translation_prod.description=EXCLUDED.description);

*/