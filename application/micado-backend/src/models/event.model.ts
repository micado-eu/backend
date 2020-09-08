import { Entity, model, property, hasMany, hasOne } from '@loopback/repository';
import { EventTranslation } from '.';
import {EventTranslationProd} from './event-translation-prod.model';

@model({
  settings: { idInjection: false, postgresql: { schema: 'micadoapp', table: 'event' } }
})
export class Event extends Entity {
  @property({
    type: 'number',
    required: false,
    scale: 0,
    id: true,
    generated: true,
    //postgresql: { columnName: 'id', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO' },
  })
  id: number;

  @property({
    type: 'string',
    length: 70,
    postgresql: { columnName: 'link', dataType: 'character varying', dataLength: 70, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  link?: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: { columnName: 'published', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO' },
  })
  published: boolean;

  @property({
    type: 'date',
    jsonSchema: { nullable: true },
    postgresql: { columnName: 'publication_date', dataType: 'timestamp without time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  publicationDate?: string;

  @property({
    type: 'number',
    required: false,
    scale: 0,
    postgresql: { columnName: 'category', dataType: 'int2', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES' },
  })
  category?: number;

  @hasMany(() => EventTranslation, { keyTo: 'id' })
  translations: EventTranslation[];

  @hasMany(() => EventTranslationProd, {keyTo: 'id'})
  translations_prod: EventTranslationProd[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [prop: string]: any;

  constructor(data?: Partial<Event>) {
    super(data);
  }
}

export interface EventRelations {
  // describe navigational properties here
}

export type EventWithRelations = Event & EventRelations;
