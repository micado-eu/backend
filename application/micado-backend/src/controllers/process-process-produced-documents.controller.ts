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
  Process,
  ProcessProducedDocuments,
} from '../models';
import {ProcessRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

@authenticate('micado')
export class ProcessProcessProducedDocumentsController {
  constructor(
    @repository(ProcessRepository) protected processRepository: ProcessRepository,
  ) { }

  @get('/processes/{id}/process-produced-documents', {
    responses: {
      '200': {
        description: 'Array of Process has many ProcessProducedDocuments',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProcessProducedDocuments)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ProcessProducedDocuments>,
  ): Promise<ProcessProducedDocuments[]> {
    return this.processRepository.producedDoc(id).find(filter);
  }

  @post('/processes/{id}/process-produced-documents', {
    responses: {
      '200': {
        description: 'Process model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProcessProducedDocuments)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Process.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessProducedDocuments, {
            title: 'NewProcessProducedDocumentsInProcess',
            //exclude: ['idProcess'],
            optional: ['idProcess']
          }),
        },
      },
    }) processProducedDocuments: Omit<ProcessProducedDocuments, 'idProcess'>,
  ): Promise<ProcessProducedDocuments> {
    return this.processRepository.producedDoc(id).create(processProducedDocuments);
  }

  @patch('/processes/{id}/process-produced-documents', {
    responses: {
      '200': {
        description: 'Process.ProcessProducedDocuments PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessProducedDocuments, {partial: true}),
        },
      },
    })
    processProducedDocuments: Partial<ProcessProducedDocuments>,
    @param.query.object('where', getWhereSchemaFor(ProcessProducedDocuments)) where?: Where<ProcessProducedDocuments>,
  ): Promise<Count> {
    return this.processRepository.producedDoc(id).patch(processProducedDocuments, where);
  }

  @del('/processes/{id}/process-produced-documents', {
    responses: {
      '200': {
        description: 'Process.ProcessProducedDocuments DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProcessProducedDocuments)) where?: Where<ProcessProducedDocuments>,
  ): Promise<Count> {
    return this.processRepository.producedDoc(id).delete(where);
  }
}
