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
import {TSettings} from '../models';
import {TSettingsRepository,LanguagesRepository} from '../repositories';

export class TSettingsController {
  constructor(
    @repository(TSettingsRepository)
    public tSettingsRepository : TSettingsRepository,
    @repository(LanguagesRepository) protected languagesRepository: LanguagesRepository,

  ) {}

  @post('/t-settings', {
    responses: {
      '200': {
        description: 'TSettings model instance',
        content: {'application/json': {schema: getModelSchemaRef(TSettings)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TSettings, {
            title: 'NewTSettings',
            exclude: ['id'],
          }),
        },
      },
    })
    tSettings: Omit<TSettings, 'id'>,
  ): Promise<TSettings> {
    return this.tSettingsRepository.create(tSettings);
  }

  @get('/t-settings/count', {
    responses: {
      '200': {
        description: 'TSettings model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(TSettings) where?: Where<TSettings>,
  ): Promise<Count> {
    return this.tSettingsRepository.count(where);
  }

  @get('/t-settings', {
    responses: {
      '200': {
        description: 'Array of TSettings model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TSettings, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(TSettings) filter?: Filter<TSettings>,
  ): Promise<TSettings[]> {
    return this.tSettingsRepository.find(filter);
  }

  @patch('/t-settings', {
    responses: {
      '200': {
        description: 'TSettings PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TSettings, {partial: true}),
        },
      },
    })
    tSettings: TSettings,
    @param.where(TSettings) where?: Where<TSettings>,
  ): Promise<Count> {
    return this.tSettingsRepository.updateAll(tSettings, where);
  }

  @get('/t-settings/{id}', {
    responses: {
      '200': {
        description: 'TSettings model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TSettings, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TSettings, {exclude: 'where'}) filter?: FilterExcludingWhere<TSettings>
  ): Promise<TSettings> {
    return this.tSettingsRepository.findById(id, filter);
  }

  @patch('/t-settings/{id}', {
    responses: {
      '204': {
        description: 'TSettings PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TSettings, {partial: true}),
        },
      },
    })
    tSettings: TSettings,
  ): Promise<void> {
    await this.tSettingsRepository.updateById(id, tSettings);
  }

  @put('/t-settings/{id}', {
    responses: {
      '204': {
        description: 'TSettings PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tSettings: TSettings,
  ): Promise<void> {
    await this.tSettingsRepository.replaceById(id, tSettings);
  }

  @del('/t-settings/{id}', {
    responses: {
      '204': {
        description: 'TSettings DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tSettingsRepository.deleteById(id);
  }

  @get('/t-settings-migrant', {
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
    return this.tSettingsRepository.dataSource.execute(
      "select * from t_settings ts inner join t_settings_translation_prod tstp  on ts.id = tstp.id and tstp.lang = $2 union select * from t_settings ts inner join t_settings_translation_prod tstp on ts.id = tstp.id and tstp.lang = $1 and ts.id not in ( select ts.id from t_settings ts inner join t_settings_translation_prod tstp on ts.id = tstp.id and tstp.lang = $2)",
      [defaultlang, currentlang]
    );
  }

  @get('/t-settings/to-production', {
    responses: {
      '200': {
        description: 'process GET for the frontend',
      },
    },
  })
  async publish (
    @param.query.number('id') id:number,
  ): Promise<void> {
    //let settings = await this.settingsRepository.find({});
    //let lang_filter = { where: { active: true } }
    let languages = await this.languagesRepository.find({ where: { active: true } });
    //let def_lang = settings.filter((el: any) => { return el.key === 'default_language' })[0]
    //let idx = languages.findIndex(el => el.lang == def_lang.value)
    //languages.splice(idx, 1)
    //this.topicRepository.dataSource.execute("insert into topic_translation_prod(id, lang ,topic,translation_date) select topic_translation.id, topic_translation.lang, topic_translation.topic, topic_translation.translation_date from topic_translation  where "+'"translationState"'+" >= '2' and id=$1 and lang=$2", [id, def_lang.value]);
    languages.forEach((lang:any)=>{
      this.tSettingsRepository.dataSource.execute("insert into t_settings_translation_prod(id, lang ,value) select t_settings_translation.id, t_settings_translation.lang, t_settings_translation.value from t_settings_translation  where "+'"translationState"'+" = '1' and id=$1 and lang=$2 and translated=true", [id, lang.lang]);
    })
  }

  @get('/t-settings-welcome-pa', {
    responses: {
      '200': {
        description: 'Array of TSettings model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TSettings, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find_specific(
    @param.filter(TSettings) filter?: Filter<TSettings>,
  ): Promise<TSettings[]> {
    let mixed_settings = await this.tSettingsRepository.find(filter);
    console.log(mixed_settings)
    let returned_settings = mixed_settings.filter((set:any)=>{
      return set.key =='policy' || set.key =='guides' || set.key =='info'|| set.key =='event'|| set.key =='doc'|| set.key =='plan'
    })
    return returned_settings
  }
}

