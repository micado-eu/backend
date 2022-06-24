// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/context';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {get, post,param, requestBody, RequestContext} from '@loopback/rest';
import { EventRepository} from '../repositories';
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
  async translations (
  ): Promise<any> {
    //Preconditions

    return this.weblateService.translations(this.calcAuth(), process.env.TRANSLATION_HOSTNAME);

  }

  calcAuth () {
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
    const rawBody = translation.toString();
    console.log(rawBody)
    let lang = target_language.toLowerCase()
    let references = external_reference.split(':')
    console.log(lang)
    console.log(references)
let buff = new Buffer(rawBody, 'base64');
let text = buff.toString('utf8');

    console.log(text)
    let sql = "update " + references[0]+"_translation SET " + references[1] + "=$1 where lang=$2 and id=$3"
    let result = await this.eventRepository.dataSource.execute(sql , [text, lang, references[2]]);
    console.log(result)

    console.log(sql)
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
