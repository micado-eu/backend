import {AuthenticationStrategy} from '@loopback/authentication';
import {MicadoUserService, MicadoUserServiceBindings} from '../services/user.service'
import {inject} from '@loopback/context';
import { AuthUser } from '../models';
import {UserProfile} from '@loopback/security';
import { Request} from '@loopback/rest';
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
console.log(request.headers)
console.log(request.headers.authorization)
//if(request.headers.authorization){
const tokenparts: any = request.headers.authorization?.split(' ')
console.log(tokenparts[1])

console.log('prima di keycloak')

const axios = require('axios').default;
await axios.get('http://keycloak.micado.csi.it:8100/auth/realms/micado/protocol/openid-connect/userinfo', {
    headers: {
        'Authorization': 'Bearer ' + tokenparts[1]
    }
  })
  .then(function (response: any) {
    console.log(response);
  })
  .catch(function (error: any) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });  

/*
const keycloak = require('keycloak-backend')({
    "realm": "micado",
    "auth-server-url": "http://keycloak:8100",
    "client_id": "migrant",
//    "client_secret": "c88a2c21-9d1a-4f83-a18d-66d75c4d8020", // if required
    "username": "admin",
    "password": "Pa55w0rd"
});
console.log(keycloak)
console.log('prima verify')
let token = await keycloak.jwt.verify(tokenparts[1]);

console.log(token.isExpired());
console.log(token.hasRealmRole('user'));
*/
//}
  let uu = new AuthUser({username: 'pippo'})
      return uu;
    }
  }