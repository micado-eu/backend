import { Entity, model, property, hasMany, belongsTo } from '@loopback/repository';
import { InterventionTypesTranslation } from './intervention-types-translation.model';
import { InterventionCategory } from './intervention-category.model';

@model({
  settings: {
    idInjection: false,
    postgresql: { schema: 'micadoapp', table: 'intervention_types' }
  }
})
export class InterventionTypes extends Entity {
  @property({
    type: 'Number',
    required: false,
    scale: 0,
    id: true,
    generated: true,
    //    postgresql: {columnName: 'id', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  id: number;

  @property({
    type: 'number',
    required: false,
    scale: 0,
    jsonSchema: { nullable: true },
    postgresql: { columnName: 'category_type', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO' },
  })
  categoryType: number;


  @property({
    type: 'boolean'
  })
  published?: boolean;

  @property({
    type: 'date',
    jsonSchema: { nullable: true },
    postgresql: { columnName: 'publication_date', dataType: 'timestamp without time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  publicationDate?: string;

  @hasMany(() => InterventionTypesTranslation, { keyTo: 'id' })
  translations: InterventionTypesTranslation[];


  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //  [prop: string]: any;

  constructor(data?: Partial<InterventionTypes>) {
    super(data);
  }
}

export interface InterventionTypesRelations {
  // describe navigational properties here
}

export type InterventionTypesWithRelations = InterventionTypes & InterventionTypesRelations;
