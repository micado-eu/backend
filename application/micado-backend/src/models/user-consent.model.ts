import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, postgresql: {schema: 'micadoapp', table: 'user_consent'}}
})
export class UserConsent extends Entity {
  @property({
    type: 'string',
    required: true,
    scale: 0,
    id: 1,
    postgresql: {columnName: 'id_user', dataType: 'uuid', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  idUser: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'consent', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  consent?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //[prop: string]: any;

  constructor(data?: Partial<UserConsent>) {
    super(data);
  }
}

export interface UserConsentRelations {
  // describe navigational properties here
}

export type UserConsentWithRelations = UserConsent & UserConsentRelations;
