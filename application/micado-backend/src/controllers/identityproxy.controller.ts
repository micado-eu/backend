// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import { get, param, HttpErrors } from '@loopback/rest';
import {
  IdentityService,
  ConsentParameters,
  DivideResponse,
} from '../services/identity.service'

export class IdentityproxyController {
  constructor(
    @inject('services.Identity')
    protected identityService: IdentityService,
  ) { }

  @get('/consent/{tenant}/{principal}')
  async consent (
    @param.path.string('tenant') tenant: string,
    @param.path.string('principal') principal: string,
  ): Promise<DivideResponse> {
    //Preconditions

    return this.identityService.consent(<ConsentParameters>{
      tenant,
      principal,
    });

  }

}
