import { Entity, model, property, hasMany } from '@loopback/repository';
import { InterventionCategoryTranslation } from './intervention-category-translation.model';

@model({
  settings: {
    idInjection: false,
    postgresql: { schema: 'micadoapp', table: 'intervention_category' }
  }
})
export class InterventionCategory extends Entity {
  @property({
    type: 'number',
    required: false,
    scale: 0,
    id: 1,
    generated:true,
   // postgresql: { columnName: 'id', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO' },
  })
  id: number;



  @property({
    type: 'boolean',
  })
  published?: boolean;

  @property({
    type: 'date',
    jsonSchema: { nullable: true },
    postgresql: { columnName: 'publication_date', dataType: 'timestamp without time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  publicationDate?: string;

  @hasMany(() => InterventionCategoryTranslation, { keyTo: 'id' })
  translations: InterventionCategoryTranslation[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [prop: string]: any;

  constructor(data?: Partial<InterventionCategory>) {
    super(data);
  }
}

export interface InterventionCategoryRelations {
  // describe navigational properties here
}

export type InterventionCategoryWithRelations = InterventionCategory & InterventionCategoryRelations;
