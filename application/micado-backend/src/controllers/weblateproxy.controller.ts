// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/context';
import {get, post, requestBody, RequestContext} from '@loopback/rest';
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



  @post('/e-translations')
  async webhook(
    @requestBody({
      content: {
        'application/x-www-form-urlencoded': {
          schema: { type: 'object' },
        }
      }
    }) translation: Object
  ): Promise<any> {
    console.log(translation)

  }


}
