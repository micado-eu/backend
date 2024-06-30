import { Entity, model, property, hasMany, hasOne } from '@loopback/repository';


@model({ settings: { forceId: false,idInjection: false, postgresql: {schema: 'micadoapp', table: 'user'} } })
export class Userone extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  realm?: string;

  @property({
    type: 'string',
  })
  group?: string;


  constructor(data?: Partial<Userone>) {
    super(data);
  }
}

export interface UseroneRelations {
  // describe navigational properties here
}

export type UseroneWithRelations = Userone & UseroneRelations;
