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
import fs from 'fs';

const simpleGit = require('simple-git');


var config = {
  MICADO_BACKEND_URL: process.env.MICADO_BACKEND_URL,
  MICADO_GIT_URL: process.env.MICADO_GIT_URL,
  MICADO_GIT_PASSWORD: process.env.MICADO_GIT_PASSWORD,
  TRANSLATIONS_DIR: "/tmp/translations"
}

if (!config.MICADO_GIT_URL) {
  console.log('MICADO_GIT_URL must be set');
  process.exit(1)
}


const git = simpleGit(config.TRANSLATIONS_DIR);


export class SendToTranslationController {
  constructor(
    @repository(TopicTranslationRepository) public topicTranslationRepository: TopicTranslationRepository,
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

    // Initial git setup
    await git
      .init()
      .addRemote('origin', config.MICADO_GIT_URL) 
      .commit('Initial Commit', {'--allow-empty': null})
      .push(['-u', 'origin', 'master'])
      .catch(() => {
        // We silently fail when the remote is already set.
        // We cant to run all of the above commands only the first time to make sure all is setup well.
      })
  
  
    // Sync from git remote
    console.log("Pulling remote changes...")
  
    await git
      .pull('origin', 'master', {'--no-edit': null})
      .catch((err: Error) => {
        console.log(JSON.stringify(err, ["message", "arguments", "type", "name"]))
        process.exit(1)
      });



    // here we need to update all the rows of the translation tables that has translationStatus = 1 setting it to translationStatus=2

    // here we need to get all the active languages so that this will allows us to cycle to the tables


    let lang = 'en'
    let model = 'glossery'
    
    let records = await this.getTranslationForModelAndLang(model, lang)
    
    let filename = this.buildFileName(model, lang)
    
    this.jsonToFile(records, filename)
    
    

    // for each language we select from all _translation tables the rows that have translationState = 2 and get the data
    // write the data to file in the repository copy in the local FS



    // after the cycle and after having saved all the files (and overwritten the previous files) add all to a commit and push to GITEA
    console.log(` > Committing and pushing language file`)
    
      git
        .add(filename)
        .commit(`Updated translation file: ${filename}`)
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
  async getTranslationForModelAndLang(model: String, lang: String) {
    let query = 'select array_to_json(array_agg(k)) from(select json_build_object(id, (select row_to_json(t) from(select gl.title, gl.description from glossary_translation as gl where gl.id = glossary_translation.id and gl.lang = \'$1\') as t)) as "record" from glossary_translation where lang = \'$1\' and "translationState" = 1) as k'
    
    let recordsForLang = {}
    
    await this.topicTranslationRepository.dataSource.execute(query, [lang]).then(result => {
      recordsForLang = result[0].array_to_json
    }) 
    
    return recordsForLang
  }
  
  
  /**
   * Build the filename for the translation file based on the language and the model.
   * 
   * @param model 
   * @param lang 
   */
  buildFileName(model: String, lang: String) {
    return `${model}.${lang}.json`
  }
  
  
  /**
   * Save the translation object to json file. 
   * 
   * @param data 
   * @param filename
   */
  jsonToFile(data: any, filename: String) {
    data = JSON.stringify(data);
    fs.writeFileSync(`${config.TRANSLATIONS_DIR}/${filename}`, data);
  }
  
  /**
   * Read the translation object from a json file. 
   * 
   * @param filename
   */
  fileToJSon(filename: String) {
    let raw_data = fs.readFileSync(`${config.TRANSLATIONS_DIR}/${filename}`);
    return JSON.parse(raw_data.toString())
  }
}
