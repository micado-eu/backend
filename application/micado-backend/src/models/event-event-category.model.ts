import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Event } from './event.model';
import { EventCategory } from './event-category.model';

@model({
  settings: {
    idInjection: false,
    postgresql: { schema: 'micadoapp', table: 'event_event_category' }
  }
})
export class EventEventCategory extends Entity {
  @belongsTo(() => Event)
  idEvent: number;

  @belongsTo(() => EventCategory)
  idEventCategory: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [prop: string]: any;

  constructor(data?: Partial<EventEventCategory>) {
    super(data);
  }
}

export interface EventEventCategoryRelations {
  // describe navigational properties here
}

export type EventEventCategoryWithRelations = EventEventCategory & EventEventCategoryRelations;
