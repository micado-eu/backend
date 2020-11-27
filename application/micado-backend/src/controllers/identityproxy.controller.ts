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
      this.calcAuth(),
      process.env.IDENTITY_HOSTNAME + ":9443"
    );

  }

  @get('/receipt/{receipt}')
  async receipt (
    @param.path.string('receipt') receipt: string,
  ): Promise<any> {
    //Preconditions
    console.log("in the identity controller")
    console.log(receipt)
    //"YWRtaW5AbWlncmFudHMubWljYWRvLmV1Om1pY2Fkb2FkbTIwMjA="
    return this.identityService.receipt(
      receipt,
      this.calcAuth(),
      process.env.IDENTITY_HOSTNAME + ":9443"
    );

  }

  calcAuth () {
    var b = Buffer.from(process.env.WSO2_IDENTITY_ADMIN_USER + ':' + process.env.WSO2_IDENTITY_ADMIN_PWD);
    // If we don't use toString(), JavaScript assumes we want to convert the object to utf8.
    // We can make it convert to other formats by passing the encoding type to toString().
    var s = b.toString('base64');
    return s
  }

}
