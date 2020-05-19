import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'micadoapp', table: 'event_event_category'}
  }
})
export class EventEventCategory extends Entity {
  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {columnName: 'id_event', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  idEvent: number;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {columnName: 'id_event_category', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  idEventCategory: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<EventEventCategory>) {
    super(data);
  }
}

export interface EventEventCategoryRelations {
  // describe navigational properties here
}

export type EventEventCategoryWithRelations = EventEventCategory & EventEventCategoryRelations;
