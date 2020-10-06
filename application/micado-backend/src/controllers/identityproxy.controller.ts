// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import { get, param, HttpErrors } from '@loopback/rest';
import {
  IdentityService,

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
  ): Promise<String> {
    //Preconditions
    console.log("in the identity controller")
    console.log(tenant)
    console.log(principal)
    return this.identityService.consent(
      tenant,
      principal,
      "YWRtaW5AbWlncmFudHMubWljYWRvLmV1Om1pY2Fkb2FkbTIwMjA="
    );

  }

  @get('/receipt/{receipt}')
  async receipt (
    @param.path.string('receipt') receipt: string,
  ): Promise<any> {
    //Preconditions
    console.log("in the identity controller")
    console.log(receipt)
    return this.identityService.receipt(
      receipt,
      "YWRtaW5AbWlncmFudHMubWljYWRvLmV1Om1pY2Fkb2FkbTIwMjA="
    );

  }

}
