// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  AnyType,
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
import { TopicTranslationRepository } from '../repositories';
import { LanguagesRepository } from '../repositories';
import { SettingsRepository } from '../repositories';

import fs from 'fs';

const simpleGit = require('simple-git');


var config = {
  MICADO_BACKEND_URL: process.env.MICADO_BACKEND_URL,
  MICADO_GIT_URL: process.env.MICADO_GIT_URL,
  MICADO_GIT_PASSWORD: process.env.MICADO_GIT_PASSWORD,
  TRANSLATIONS_DIR: "git"
}

if (!config.MICADO_GIT_URL) {
  console.log('MICADO_GIT_URL must be set');
  process.exit(1)
}


const git = simpleGit(config.TRANSLATIONS_DIR);



export class SendToTranslationController {
  constructor(
    @repository(TopicTranslationRepository) public topicTranslationRepository: TopicTranslationRepository,
    @repository(LanguagesRepository) protected languagesRepository: LanguagesRepository,
    @repository(SettingsRepository) protected settingsRepository: SettingsRepository,

  ) { }


  @get('/sendtotranslation', {
    responses: {
      '200': {
        description: 'Topic export',
        content: { 'application/json': { schema: AnyType } },
      },
    },
  })
  async sendtotranslation (

  ): Promise<any> {
    console.log(config.MICADO_GIT_URL)

    let settings = await this.settingsRepository.find({});
    //   let lang_filter = { where: { active: true } }
    let languages = await this.languagesRepository.find({ where: { active: true } });

    // Initial git setup
    /*
    await git
      .init()
//      .addRemote('origin', config.MICADO_GIT_URL)
      .addRemote('origin', 'https://micadoadmin:gitea@git.micadoproject.eu/micadoadmin/backend')
      .commit('Initial Commit', { '--allow-empty': null })
      .push(['-u', 'origin', 'master'])
      .catch(() => {
        // We silently fail when the remote is already set.
        // We cant to run all of the above commands only the first time to make sure all is setup well.
      })
*/
    await git.checkIsRepo()
      .then((isRepo: any) => {
        console.log("cheching if is a repo")
        console.log(isRepo)
        if (!isRepo) {
          return git.init()
            .addRemote('origin', 'https://micadoadmin:gitea@git.micadoproject.eu/micadoadmin/backend')
            .commit('Initial Commit', { '--allow-empty': null })
            .push(['-u', 'origin', 'master'])
            .catch(() => {
              // We silently fail when the remote is already set.
              // We cant to run all of the above commands only the first time to make sure all is setup well.
              console.log("error in init")
            })
        }
      })
    //      .then(() => git.fetch());


    // Sync from git remote
    console.log("Pulling remote changes...")
    /*
        await git
          .pull('origin', 'master', { '--no-edit': null })
          .catch((err: Error) => {
            console.log(JSON.stringify(err, ["message", "arguments", "type", "name"]))
            process.exit(1)
          });
    */


    // here we need to update all the rows of the translation tables that has translationStatus = 1 setting it to translationStatus=2

    // here we need to get all the active languages so that this will allows us to cycle to the tables


    //   let lang = 'en'

    // TODO fix Promises that do not work properly

    let model = 'glossary'
    let files: String[] = []

    languages.forEach((alang: any) => {
      console.log("cycle in lang: " + alang.lang)
      this.getTranslationForModelAndLang(model, alang.lang)
        .then(records => {
          let recordsForLang = records[0].array_to_json
          console.log("managing a language")
          console.log(recordsForLang)
          let filename = this.buildFileName(model, alang.lang)
          console.log(filename)
          files.push(filename)
          this.jsonToFile(recordsForLang, filename)
        })
      console.log("after managing lang: " + alang.lang)
    })







    // for each language we select from all _translation tables the rows that have translationState = 2 and get the data
    // write the data to file in the repository copy in the local FS



    // after the cycle and after having saved all the files (and overwritten the previous files) add all to a commit and push to GITEA
    console.log(` > Committing and pushing language file`)

    git
      .add(files)
      .commit(`Updated translation file`)
      .push()
      .catch((err: Error) => {
        console.log(JSON.stringify(err, ["message", "arguments", "type", "name"]))
      });



    /*
    //   let allTopics: any
    let allTopics = await this.topicTranslationRepository.find()
    console.log(allTopics)
    let lang = ["en"]
    //   let engTopics = allTopics.filter(function (atopic: any) { return atopic.lang == lang })

    lang.forEach(alang => {

      let langTopics = allTopics.filter(function (atopic: any) { return atopic.lang == alang })
      let exportArray = JSON.parse("[]")
      langTopics.forEach(record => {
        exportArray.push({ id: record.id, content: { topic: record.topic } })
      });
      console.log(exportArray)
      fs.writeFile("topics." + alang + ".json", JSON.stringify(exportArray), (err) => {
        if (err) console.log(err)
      })
    });

*/



    return "koekestad";
  }



  /**
   * Get all the translations for the given model
   *
   * @param model 
   * @param lang 
   */
  getTranslationForModelAndLang (model: String, lang: String): Promise<any> {
    let query = 'select array_to_json(array_agg(k)) from(select json_build_object(id, (select row_to_json(t) from(select gl.title, gl.description from glossary_translation as gl where gl.id = glossary_translation.id and gl.lang = \'' + lang + '\') as t)) as "record" from glossary_translation where lang = \'' + lang + '\' and "translationState" = 1) as k'

    //   let recordsForLang = {}

    return this.topicTranslationRepository.dataSource.execute(query)
    /*.then(result => {
      recordsForLang = result[0].array_to_json
      return new Promise(function (resolve, reject) {
        resolve(recordsForLang)
      })
      
    })*/
  }


  /**
   * Build the filename for the translation file based on the language and the model.
   * 
   * @param model 
   * @param lang 
   */
  buildFileName (model: String, lang: String) {
    return `${model}.${lang}.json`
  }


  /**
   * Save the translation object to json file. 
   * 
   * @param data 
   * @param filename
   */
  jsonToFile (data: any, filename: String) {
    data = JSON.stringify(data);
    fs.writeFileSync(`${config.TRANSLATIONS_DIR}/${filename}`, data);
  }

  /**
   * Read the translation object from a json file. 
   * 
   * @param filename
   */
  fileToJSon (filename: String) {
    let raw_data = fs.readFileSync(`${config.TRANSLATIONS_DIR}/${filename}`);
    return JSON.parse(raw_data.toString())
  }
}
