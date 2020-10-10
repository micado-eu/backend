// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import { get, param, HttpErrors } from '@loopback/rest';
import {
  WeblateService
} from '../services/weblate.service'

export class WeblateproxyController {
  constructor(
    @inject('services.Weblate')
    protected weblateService: WeblateService,
  ) { }

  @get('/translations')
  async translations (
  ): Promise<any> {
    //Preconditions

    return this.weblateService.translations();

  }

}
