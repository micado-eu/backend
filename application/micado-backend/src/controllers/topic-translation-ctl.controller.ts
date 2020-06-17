// Uncomment these imports to begin using these cool features!
import { repository } from '@loopback/repository'
import { TopicTranslationRepoRepository } from '../repositories/topic-translation-repo.repository'
import { TopicTranslation } from '../models/topic-translation.model'
import { get, param, HttpErrors } from '@loopback/rest';

// import {inject} from '@loopback/context';


export class TopicTranslationCtlController {
  constructor(
    @repository(TopicTranslationRepoRepository) public repository: TopicTranslationRepoRepository
  ) { }


  @get('/topotranslation')
  async consent (

  ): Promise<TopicTranslation> {
    //Preconditions

    const tt: TopicTranslation = new TopicTranslation()
    tt.id = 1
    tt.lang = 'it'
    tt.topic = 'testo'
    console.log(tt)
    return this.repository.create(tt)
      //    return ""
      ;

  }

}
