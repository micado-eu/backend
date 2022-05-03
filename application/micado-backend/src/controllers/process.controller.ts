import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody
} from '@loopback/rest';
import {Process} from '../models';
import {LanguagesRepository, ProcessRepository, SettingsRepository} from '../repositories';
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {inject} from '@loopback/context';



export class ProcessController {
  constructor(
    @repository(ProcessRepository) public processRepository: ProcessRepository,
    @repository(SettingsRepository) protected settingsRepository: SettingsRepository,
    @repository(LanguagesRepository) protected languagesRepository: LanguagesRepository,
    @inject(SecurityBindings.USER, {optional:true}) private userProfile: UserProfile, 
  ) { }

  @post('/processes', {
    responses: {
      '200': {
        description: 'Process model instance',
        content: {'application/json': {schema: getModelSchemaRef(Process)}},
      },
    },
  })
  async create(
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
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
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
              items: getModelSchemaRef(Process, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  @authenticate('micado')
  async find(
    @param.filter(Process) filter?: Filter<Process>,
  ): Promise<Process[]> {
    return this.processRepository.find(filter);
  }

  @patch('/processes', {
    responses: {
      '200': {
        description: 'Process PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Process, {partial: true}),
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
            schema: getModelSchemaRef(Process, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Process, {exclude: 'where'}) filter?: FilterExcludingWhere<Process>
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
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Process, {partial: true}),
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
  async replaceById(
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
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.processRepository.deleteById(id);
  }

  @get('/processes-migrant', {
    responses: {
      '200': {
        description: 'process GET for the frontend',
      },
    },
  })
  async translatedunion(
    @param.query.string('defaultlang') defaultlang = 'en',
    @param.query.string('currentlang') currentlang = 'en'
  ): Promise<void> {
    return this.processRepository.dataSource.execute(
      "select *, (select to_jsonb(array_agg(pt.id_topic)) from process_topic pt where pt.id_process=t.id) as topics, (select to_jsonb(array_agg(pu.id_user_types)) from process_users pu where pu.id_process=t.id) as users,(select coalesce(avg(value),0) from ratings r where r.content_type=1 AND r.content_id=t.id) as rating from process t inner join process_translation_prod tt on t.id=tt.id and tt.lang=$2 union select *, (select to_jsonb(array_agg(pt.id_topic)) from process_topic pt where pt.id_process=t.id) as topics, (select to_jsonb(array_agg(pu.id_user_types)) from process_users pu where pu.id_process=t.id) as users,(select coalesce(avg(value),0) from ratings r where r.content_type=1 AND r.content_id=t.id) as rating from process t inner join process_translation_prod tt on t.id = tt.id and tt.lang = $1 and t.id not in (select t.id from process t inner join process_translation_prod tt on t.id = tt.id and tt.lang = $2)",
      [defaultlang, currentlang]
    );
  }

  @get('/temp-processes-migrant', {
    responses: {
      '200': {
        description: 'process GET for the frontend',
      },
    },
  })
  async tempunion(
    @param.query.string('defaultlang') defaultlang = 'en',
    @param.query.string('currentlang') currentlang = 'en'
  ): Promise<void> {
    return this.processRepository.dataSource.execute(
      "select *, (select to_jsonb(array_agg(pt.id_topic)) from process_topic pt where pt.id_process=t.id) as topics, (select to_jsonb(array_agg(pu.id_user_types)) from process_users pu where pu.id_process=t.id) as users,(select coalesce(avg(value),0) from ratings r where r.content_type=1 AND r.content_id=t.id) as rating from process t inner join process_translation tt on t.id=tt.id and tt.lang=$2 union select *, (select to_jsonb(array_agg(pt.id_topic)) from process_topic pt where pt.id_process=t.id) as topics, (select to_jsonb(array_agg(pu.id_user_types)) from process_users pu where pu.id_process=t.id) as users,(select coalesce(avg(value),0) from ratings r where r.content_type=1 AND r.content_id=t.id) as rating from process t inner join process_translation tt on t.id = tt.id and tt.lang = $1 and t.id not in (select t.id from process t inner join process_translation tt on t.id = tt.id and tt.lang = $2)",
      [defaultlang, currentlang]
    );
  }

  @get('/processes/to-production', {
    responses: {
      '200': {
        description: 'process GET for the frontend',
      },
    },
  })
  async publish(
    @param.query.number('id') id: number,
  ): Promise<void> {
    //let settings = await this.settingsRepository.find({});
    //   let lang_filter = { where: { active: true } }
    const languages = await this.languagesRepository.find({where: {active: true}});
    //let def_lang = settings.filter((el: any) => { return el.key === 'default_language' })[0]
    //let idx = languages.findIndex(el => el.lang == def_lang.value)
    //languages.splice(idx, 1)

    //this.processRepository.dataSource.execute("insert into process_translation_prod(id, lang ,process , description ,translation_date) select process_translation.id, process_translation.lang, process_translation.process, process_translation.description , process_translation.translation_date from process_translation  where "+'"translationState"'+" >= '2' and id=$1 and lang=$2", [id, def_lang.value]);
    languages.forEach((lang: any) => {
      this.processRepository.dataSource.execute("insert into process_translation_prod(id, lang ,process , description ,translation_date) select process_translation.id, process_translation.lang, process_translation.process, process_translation.description , process_translation.translation_date from process_translation  where " + '"translationState"' + " = '1' and id=$1 and lang=$2 and translated=true", [id, lang.lang]);
    })
  }

  @get('/processes/to-json', {
    responses: {
      '200': {
        description: 'process GET for the frontend',
      },
    },
  })
  async getJson(
    @param.query.number('id') id: number,
  ): Promise<any> {
    //let process_documents:any = await this.processRepository.dataSource.execute("select *, ( select to_jsonb(array_agg(pt)) from document_type_translation pt where pt.id = t.id) as translations from document_type t where id in (select ppd.id_document from process_produced_documents ppd where ppd.id_process ="  + id +")")
    const process: any = await this.processRepository.dataSource.execute("select *, ( select to_jsonb(array_agg(pt)) from process_translation pt where pt.id = p.id) as translations, (select to_jsonb(array_agg(sub)) from (select *, ( select to_jsonb(array_agg(pt)) from document_type_translation pt where pt.id = t.id) as translations from document_type t where id in ( select ppd.id_document from process_produced_documents ppd where ppd.id_process = p.id)) sub) as documents from process p where p.id = " + id)
    const steps: any = await this.processRepository.dataSource.execute("select *, ( select to_jsonb(array_agg(pt)) from step_translation pt where pt.id = s.id) as translations, ( select to_jsonb(array_agg(sd)) from step_document sd where sd.id_step = s.id) as step_documents,	(select to_jsonb(array_agg(sub)) from (select *,( select to_jsonb(array_agg(pt)) from document_type_translation pt where pt.id = t.id) as translations from document_type t where id in ( select sd.id_document from step_document sd where sd.id_step = s.id)) sub) as documents from step s where id_process =" + id)
    const steplinks: any = await this.processRepository.dataSource.execute("select *, ( select to_jsonb(array_agg(slt)) from step_link_translation slt  where slt.id = sl.id) as translations from step_link sl where id_process = " + id)
    const full_process = {
      process: process,
      steps: steps,
      steplinks: steplinks
    }
    return full_process

  }


}


