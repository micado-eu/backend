// Uncomment these imports to begin using these cool features!
import { repository } from '@loopback/repository'
import { LanguagesRepository } from '../repositories/languages.repository'
import { Languages } from '../models/languages.model'
import { get, post, param, HttpErrors } from '@loopback/rest';

// import {inject} from '@loopback/context';


export class TopicTranslationCtlController {
  constructor(
    @repository(LanguagesRepository) public repository: LanguagesRepository
  ) { }


  @post('/topotranslation')
  async consent (

  ): Promise<Languages> {
    //Preconditions

    const tt: Languages = new Languages()
//    tt.id = 1
    tt.lang = 'es'
    tt.name = 'espagnol'
    tt.active = false
 //   tt.topic = 'testo'
    console.log(tt)
    return this.repository.create(tt)
      //    return ""
      ;

  }

}
