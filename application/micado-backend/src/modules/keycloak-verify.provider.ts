/*
import {Provider, inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  AuthErrorKeys,
  IAuthUser,
  VerifyFunction,
} from 'loopback4-authentication';

import { AuthUserRepository} from '../repositories';
import {AuthUser} from '../models/auth-user.model';

export class KeycloakVerifyProvider
  implements Provider<VerifyFunction.KeycloakAuthFn>
{
  constructor(
    @repository(AuthUserRepository)
    public authUserRepository: AuthUserRepository,
//    @repository(UserCredentialsRepository)     public userCredsRepository: UserCredentialsRepository,
  ) {}

  value(): VerifyFunction.KeycloakAuthFn {
    return async (accessToken, refreshToken, profile) => {

        console.log('we are in the keycloak.verify')
        console.log('accessToken:' + accessToken)
        console.log('refreshToken:' + refreshToken)
        console.log('profile:' + profile)
        const authUser: AuthUser = new AuthUser({});
        /*
      let user: IAuthUser | null = await this.userRepository.findOne({
        where: {
          email: profile.email,
        },
      });
      if (!user) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      const creds = await this.userCredsRepository.findOne({
        where: {
          userId: user.id as string,
        },
      });
      if (
        !creds ||
        creds.authProvider !== 'keycloak' ||
        creds.authId !== profile.keycloakId
      ) {
        throw new HttpErrors.Unauthorized(AuthErrorKeys.InvalidCredentials);
      }
      */
/*
      const authUser: AuthUser = new AuthUser({
        ...user,
        id: user.id as string,
      });
      authUser.permissions = [];
      authUser.externalAuthToken = accessToken;
      authUser.externalRefreshToken = refreshToken;
      
      return authUser;
      
     return authUser;
    };
  }
}
*/