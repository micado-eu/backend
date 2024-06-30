import { AuthenticationStrategy } from '@loopback/authentication';
import { MicadoUserService, MicadoUserServiceBindings } from '../services/user.service'
import { inject } from '@loopback/context';
import { AuthUser } from '../models';
import { UserProfile } from '@loopback/security';
import { Request } from '@loopback/rest';
import jwt_decode from 'jwt-decode';
const https = require('https')


//import {Keycloak} from 'keycloak-backend'


export class MicadoAuthenticationStrategy implements AuthenticationStrategy {
  name: string = 'micado';

  constructor(
    //      @inject( MicadoUserServiceBindings.USER_SERVICE)     private userService: MicadoUserService,
  ) {
    console.log('construct micadoauthstrtegy')
  }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    //      const credentials: Credentials = this.extractCredentials(request);
    //      const user = await this.userService.verifyCredentials(credentials);
    //      const userProfile = this.userService.convertToUserProfile(user);
    //  const up = this.userService.convertToUserProfile(null)
    console.log('we are in authenticate of micadoauthstrategy')
    if (request.headers.authorization) {

      const tokenparts: any = request.headers.authorization?.split(' ')
      let decoded: any = jwt_decode(tokenparts[1])
      console.log(tokenparts)
      console.log(tokenparts[1])

      var iss = decoded.iss

      var iss_array = iss.split("/");
      var realm = iss_array[iss_array.length - 1]
      console.log(realm)
      console.log('calling keycloak')
      console.log('https://' + process.env.IDENTITY_HOSTNAME + '/realms/' + realm + '/protocol/openid-connect/userinfo')

      const axios = require('axios').default;
      return axios({
        url: 'https://' + process.env.IDENTITY_HOSTNAME + '/realms/' + realm + '/protocol/openid-connect/userinfo',
        method: "get",
        headers: { 'Authorization': 'Bearer ' + tokenparts[1] },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })

      }
      ).then(function (response: any) {
        console.log('response')
        console.log(response)
        if (response.status != 200) {
          console.log('error in response')
          console.log(response)
          return Promise.reject(undefined)
        }
        else {
          let uu = new AuthUser({ id: response.data.sub, email: response.data.email, username: response.data.preferred_username, firstName: response.data.given_name, lastName: response.data.family_name })
          return Promise.resolve(uu);
        }
      })
        .catch(function (error: any) {
          console.log('error in catch')
          console.log(error);
          return Promise.reject(undefined)
  
        })
    }
    else {
      return undefined
    }
  }
}