// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/context';
import {get, post,param, requestBody, RequestContext} from '@loopback/rest';
import {
  WeblateService
} from '../services/weblate.service';

export class WeblateproxyController {
  constructor(
    @inject('services.Weblate')
    protected weblateService: WeblateService,
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
        '': {       // Make sure this matches the POST request type
          'x-parser': 'text'        // This is the key to skipping parsing
        },
      },
    }) translation: any,
    @param.query.string('request-id') request_id: string,
    @param.query.string('target-language') target_language: string,
    @param.query.string('external-reference') external_reference: string,
  ): Promise<any> {
    console.log("webhook post html")
    console.log("request_id")
    console.log(request_id)
    console.log("target_language")
    console.log(target_language)
    console.log("external_reference")
    console.log(external_reference)
    console.log("translation")
    console.log(translation)
    const rawBody = translation.toString();
    console.log("raw body")
    console.log(rawBody)

    var stringified = JSON.stringify(translation)
    console.log(stringified)
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
