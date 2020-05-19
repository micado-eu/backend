import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, postgresql: {schema: 'micadoapp', table: 'features_flags'}}
})
export class FeaturesFlags extends Entity {
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
    postgresql: {columnName: 'flag_key', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  flagKey?: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: {columnName: 'enabled', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  enabled: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<FeaturesFlags>) {
    super(data);
  }
}

export interface FeaturesFlagsRelations {
  // describe navigational properties here
}

export type FeaturesFlagsWithRelations = FeaturesFlags & FeaturesFlagsRelations;
