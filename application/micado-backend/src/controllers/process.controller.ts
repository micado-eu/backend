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
import { Process } from '../models';
import { ProcessRepository } from '../repositories';

export class ProcessController {
  constructor(
    @repository(ProcessRepository)
    public processRepository: ProcessRepository,
  ) { }

  @post('/processes', {
    responses: {
      '200': {
        description: 'Process model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Process) } },
      },
    },
  })
  async create (
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Process, {
            title: 'NewProcess',
            exclude: ['id'],
          }),
        },
      },
    })
    process: Omit<Process, 'id'>,
  ): Promise<Process> {
    return this.processRepository.create(process);
  }

  @get('/processes/count', {
    responses: {
      '200': {
        description: 'Process model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count (
    @param.where(Process) where?: Where<Process>,
  ): Promise<Count> {
    return this.processRepository.count(where);
  }

  @get('/processes', {
    responses: {
      '200': {
        description: 'Array of Process model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Process, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find (
    @param.filter(Process) filter?: Filter<Process>,
  ): Promise<Process[]> {
    return this.processRepository.find(filter);
  }

  @patch('/processes', {
    responses: {
      '200': {
        description: 'Process PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll (
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Process, { partial: true }),
        },
      },
    })
    process: Process,
    @param.where(Process) where?: Where<Process>,
  ): Promise<Count> {
    return this.processRepository.updateAll(process, where);
  }

  @get('/processes/{id}', {
    responses: {
      '200': {
        description: 'Process model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Process, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById (
    @param.path.number('id') id: number,
    @param.filter(Process, { exclude: 'where' }) filter?: FilterExcludingWhere<Process>
  ): Promise<Process> {
    return this.processRepository.findById(id, filter);
  }

  @patch('/processes/{id}', {
    responses: {
      '204': {
        description: 'Process PATCH success',
      },
    },
  })
  async updateById (
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Process, { partial: true }),
        },
      },
    })
    process: Process,
  ): Promise<void> {
    await this.processRepository.updateById(id, process);
  }

  @put('/processes/{id}', {
    responses: {
      '204': {
        description: 'Process PUT success',
      },
    },
  })
  async replaceById (
    @param.path.number('id') id: number,
    @requestBody() process: Process,
  ): Promise<void> {
    await this.processRepository.replaceById(id, process);
  }

  @del('/processes/{id}', {
    responses: {
      '204': {
        description: 'Process DELETE success',
      },
    },
  })
  async deleteById (@param.path.number('id') id: number): Promise<void> {
    await this.processRepository.deleteById(id);
  }

  @get('/processes-migrant', {
    responses: {
      '200': {
        description: 'process GET for the frontend',
      },
    },
  })
  async translatedunion (
    @param.query.string('defaultlang') defaultlang = 'en',
    @param.query.string('currentlang') currentlang = 'en'
  ): Promise<void> {
    return this.processRepository.dataSource.execute("select * from process t inner join process_translation tt on t.id=tt.id and tt.lang='" +
      currentlang + "' union select * from process t inner join process_translation tt on t.id = tt.id and tt.lang = '" +
      defaultlang +
      "' and t.id not in (select t.id from process t inner join process_translation tt on t.id = tt.id and tt.lang = '" +
      currentlang + "')");
  }
}
