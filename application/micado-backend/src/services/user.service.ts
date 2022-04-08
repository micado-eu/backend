import { UserService } from "@loopback/authentication";
import {UserProfile} from '@loopback/security';
import { AuthUser } from "../models";
import {BindingKey} from '@loopback/core';


export class MicadoUserService implements UserService<any, any> {
    verifyCredentials(credentials: any): Promise<any>{
        let promise = new Promise(function(resolve, reject) {
            // esecutore (il codice produttore, "cantante")
          });
        return promise
    }

    /**
     * Convert the user returned by `verifyCredentials()` to a common
     * user profile that describes a user in your application
     * @param user - The user returned from `verifyCredentials()`
     */
    convertToUserProfile(user: any): UserProfile{
        let u = new AuthUser
        return u
    }
  
}


export namespace MicadoUserServiceBindings {
    export const USER_SERVICE = BindingKey.create<UserService<any, any>>(
      'services.user.service',
    );
  }