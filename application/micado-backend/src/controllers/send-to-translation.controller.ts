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

    // pull from GITEA

    // here we need to update all the rows of the translation tables that has translationStatus = 1 setting it to translationStatus=2

    // here we need to get all the active languages so that this will allows us to cycle to the tables


    let lang = 'en'
    let query = 'select array_to_json(array_agg(k)) from(select json_build_object(id, (select row_to_json(t) from(select gl.title, gl.description from glossary_translation as gl where gl.id = glossary_translation.id and gl.lang = \'' + lang + '\') as t)) as "record" from glossary_translation where lang = \'' + lang + '\' and "translationState" = 1) as k'
    this.generateFile('glossary', query, lang)

    // for each language we select from all _translation tables the rows that have translationState = 2 and get the data
    // write the data to file in the repository copy in the local FS



    // after the cycle and after having saved all the files (and overwritten the previous files) add all to a commit and push to GITEA




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



    return "gioppo";
  }

  generateFile (filename: String, query: String, lang: String) {
    this.topicTranslationRepository.dataSource.execute(query)
      .then(result => {
        console.log(result[0].array_to_json)
        fs.writeFile(filename + "." + lang + ".json", JSON.stringify(result[0].array_to_json), (err) => {
          if (err) console.log(err)
        })
      })
  }
}
