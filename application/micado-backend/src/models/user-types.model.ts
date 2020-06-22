import {Entity, model, property, hasMany} from '@loopback/repository';
import {UserTypesTranslation} from './user-types-translation.model';

@model({
  settings: {idInjection: false, postgresql: {schema: 'micadoapp', table: 'user_types'}}
})
export class UserTypes extends Entity {
  @property({
    type: 'number',
    required: true,
    scale: 0,
    id: 1,
    postgresql: {columnName: 'id', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  id: number;

  @property({
    type: 'string',
    //   postgresql: { columnName: 'icon', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  icon?: string;
  
  @property({
    type: 'boolean'
  })
  published?: boolean;

  @property({
    type: 'date',
    postgresql: { columnName: 'publication_date', dataType: 'timestamp without time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  publicationDate?: string;

  @hasMany(() => UserTypesTranslation, {keyTo: 'id'})
  translations: UserTypesTranslation[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
//  [prop: string]: any;

  constructor(data?: Partial<UserTypes>) {
    super(data);
  }
}

export interface UserTypesRelations {
  // describe navigational properties here
}

export type UserTypesWithRelations = UserTypes & UserTypesRelations;
