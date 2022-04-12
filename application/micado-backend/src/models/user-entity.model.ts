import { Entity, model, property, hasMany, hasOne} from '@loopback/repository';

@model({
  settings: { idInjection: false, postgresql: { schema: 'keycloak', table: 'user_entity' } }
})
export class UserEntity extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    default: null,
  })
  email?: string;

  @property({
    type: 'string',
  })
  email_constraint?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  email_verified?: boolean;

  @property({
    type: 'boolean',
    default: true,
  })
  enabled?: boolean;

  @property({
    type: 'string',
  })
  federation_link?: string;

  @property({
    type: 'string',
  })
  first_name?: string;

  @property({
    type: 'string',
  })
  last_name?: string;

  @property({
    type: 'string',
  })
  realm_id?: string;

  @property({
    type: 'string',
  })
  username?: string;

  @property({
    type: 'number',
  })
  created_timestamp?: number;

  @property({
    type: 'string',
  })
  service_account_client_link?: string;

  @property({
    type: 'number',
  })
  not_before?: number;


  constructor(data?: Partial<UserEntity>) {
    super(data);
  }
}

export interface UserEntityRelations {
  // describe navigational properties here
}

export type UserEntityWithRelations = UserEntity & UserEntityRelations;
