import { Entity, model, property, hasMany, hasOne} from '@loopback/repository';
//import {IAuthUser} from 'loopback4-authentication';
import {UserProfile, securityId} from '@loopback/security';

@model({
    name: 'authusers',
  })
  export class AuthUser extends Entity implements UserProfile {
    @property({
      type: 'number',
      id: true,
    })
    id?: number;
  
    @property({
      type: 'string',
      required: true,
      name: 'first_name',
    })
    firstName: string;
  
    @property({
      type: 'string',
      name: 'last_name',
    })
    lastName: string;
  
    @property({
      type: 'string',
      name: 'middle_name',
    })
    middleName?: string;
  
    @property({
      type: 'string',
      required: true,
    })
    username: string;
  
    @property({
      type: 'string',
    })
    email?: string;
  
    // Auth provider - 'keycloak'
    @property({
      type: 'string',
      required: true,
      name: 'auth_provider',
    })
    authProvider: string;
  
    // Id from external provider
    @property({
      type: 'string',
      name: 'auth_id',
    })
    authId?: string;
  
    @property({
      type: 'string',
      name: 'auth_token',
    })
    authToken?: string;
  
    @property({
      type: 'string',
    })
    password?: string;
  
    @property({
        type: 'string',
      })
    [securityId]: string;
    
    constructor(data?: Partial<AuthUser>) {
      super(data);
    }
  }

  export interface AuthUserRelations {
    // describe navigational properties here
  }
  
  export type AuthUserWithRelations = AuthUser & AuthUserRelations;
  