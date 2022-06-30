// Uncomment these imports to begin using these cool features!

import { inject, JSONObject } from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import { get, post, param, requestBody, RequestContext } from '@loopback/rest';
import { EventRepository } from '../repositories';
import {
  WeblateService
} from '../services/weblate.service';

export class WeblateproxyController {
  constructor(
    @inject('services.Weblate')
    protected weblateService: WeblateService,
    @repository(EventRepository)
    public eventRepository: EventRepository,
    @inject.context()
    public context: RequestContext,
  ) { }

  @get('/translations')
  async translations(
  ): Promise<any> {
    //Preconditions

    return this.weblateService.translations(this.calcAuth(), process.env.TRANSLATION_HOSTNAME);

  }

  calcAuth() {
    const b = Buffer.from(process.env.WEBLATE_ADMIN_NAME + ':' + process.env.WEBLATE_ADMIN_PASSWORD);
    // If we don't use toString(), JavaScript assumes we want to convert the object to utf8.
    // We can make it convert to other formats by passing the encoding type to toString().
    const s = b.toString('base64');
    return s
  }



  @post('/e-translations-html')
  async webhook(
    @requestBody({
      content: {
        'text/plain': {       // Make sure this matches the POST request type
          'x-parser': 'raw'        // This is the key to skipping parsing
        },
      },
    }) translation: Object,
    @param.query.string('request-id') request_id: string,
    @param.query.string('target-language') target_language: string,
    @param.query.string('external-reference') external_reference: string,
  ): Promise<any> {
//$1 is id, $2 is text $3 is lang
    /*let sqlarray:JSONObject = {
      "topic": { 
      topic: "insert into micadoapp.topic_translation (id,topic,lang,translation_date,\"translationState\", translated) VALUES ($1 ,$2,$3,now(),1, true) on conflict (id,lang, translated) do update set topic=excluded.topic,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\"",
      description: "insert into micadoapp.topic_translation (id,description,lang,translation_date,\"translationState\", translated) VALUES ($1 ,$2,$3,now(),1, true) on conflict (id,lang, translated) do update set description=excluded.description,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\""
      },
      "process": {
        process: "insert into micadoapp.process_translation (id,process,description,lang,translation_date,\"translationState\", translated) VALUES ($1 ,$2,'',$3,now(),1, true) on conflict (id,lang, translated) do update set process=excluded.process,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\"",
        description: "insert into micadoapp.process_translation (id,process,description,lang,translation_date,\"translationState\", translated) VALUES ($1 ,'',$2,$3,now(),1, true) on conflict (id,lang, translated) do update set description=excluded.description,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\""
      },
      "step": {
        step: "insert into micadoapp.step_translation (id,step,description,lang,translation_date,\"translationState\", translated) VALUES ($1 ,$2,'',$3,now(),1, true) on conflict (id,lang, translated) do update set step=excluded.step,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\"",
        description: "insert into micadoapp.step_translation (id,step,description,lang,translation_date,\"translationState\", translated) VALUES ($1 ,'',$2,$3,now(),1, true) on conflict (id,lang, translated) do update set description=excluded.description,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\""
      },
      "steplink": {
        description: "insert into micadoapp.step_link_translation (id,description,lang,translation_date,\"translationState\", translated) VALUES ($1,$2,$3,now(),1, true) on conflict (id,lang, translated) do update set description=excluded.description,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\""
      },
      "event": {
        event: "insert into micadoapp.event_translation (id,event,description,lang,translation_date,\"translationState\", translated) VALUES ($1 ,$2,'',$3,now(),1, true) on conflict (id,lang, translated) do update set event=excluded.event,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\"",
        description: "insert into micadoapp.event_translation (id,event,description,lang,translation_date,\"translationState\", translated) VALUES ($1 ,'',$2,$3,now(),1, true) on conflict (id,lang, translated) do update set description=excluded.description,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\""
      },
      "event_category": {
        event_category: "insert into micadoapp.event_category_translation (id,event_category,lang,translation_date,\"translationState\", translated) VALUES ($1,$2,$3,now(),1, true) on conflict (id,lang, translated) do update set event_category=excluded.event_category,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\""
      },
      "event_tag": {
        tag: "insert into micadoapp.event_tags_translation (id,tag,lang,translation_date,\"translationState\", translated) VALUES ($1,$2,$3,now(),1, true) on conflict (id,lang, translated) do update set tag=excluded.tag,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\""
      },
      "glossary": {
        title: "insert into micadoapp.glossary_translation (id,title,description,lang,translation_date,\"translationState\", translated) VALUES ($1 ,$2,'',$3,now(),1, true) on conflict (id,lang, translated) do update set title=excluded.title,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\"",
        description: "insert into micadoapp.glossary_translation (id,title,description,lang,translation_date,\"translationState\", translated) VALUES ($1 ,'',$2,$3,now(),1, true) on conflict (id,lang, translated) do update set description=excluded.description,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\""
      },
      "information_category": {
        information_category: "insert into micadoapp.information_category_translation (id,information_category,lang,translation_date,\"translationState\", translated) VALUES ($1,$2,$3,now(),1, true) on conflict (id,lang, translated) do update set information_category=excluded.information_category,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\""
      },
      "information_tag": {
        tag: "insert into micadoapp.information_tags_translation (id,tag,lang,translation_date,\"translationState\", translated) VALUES ($1,$2,$3,now(),1, true) on conflict (id,lang, translated) do update set tag=excluded.tag,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\""
      },
      "information": {
        information: "insert into micadoapp.information_translation (id,information,description,lang,translation_date,\"translationState\", translated) VALUES ($1 ,$2,'',$3,now(),1, true) on conflict (id,lang, translated) do update set information=excluded.information,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\"",
        description: "insert into micadoapp.information_translation (id,information,description,lang,translation_date,\"translationState\", translated) VALUES ($1 ,'',$2,$3,now(),1, true) on conflict (id,lang, translated) do update set description=excluded.description,translation_date=excluded.translation_date,\"translationState\"=excluded.\"translationState\""
      },

    }

    const rawBody = translation.toString();
    console.log(rawBody)
    let lang = target_language.toLowerCase()
    let references = external_reference.split(':')
    console.log(lang)
    console.log(references)
    let buff = new Buffer(rawBody, 'base64');
    let text = buff.toString('utf8');
    console.log(text)
    let tablejson:any = sqlarray[references[0]]
    let sql2 =tablejson[references[1]]
    console.log(sql2)
    let result = await this.eventRepository.dataSource.execute(sql2, [references[2], text, lang ]);
    console.log(result)

    console.log(sql2)*/
    console.log("e-translation-service-answered")
  }


  @post('/e-translations')
  async webhook2(
    @requestBody({
      content: {
        'application/x-www-form-urlencoded': {
          schema: { type: 'object' },
        }
      }
    }) translation: Object
  ): Promise<any> {
    console.log("webhook post base")
    console.log(translation)

  }


}
