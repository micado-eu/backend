import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'micadoapp', table: 'comment_translation'}
  }
})
export class CommentTranslation extends Entity {
  @property({
    type: 'string',
    required: true,
    length: 10,
    id: 2,
    postgresql: {columnName: 'lang', dataType: 'character varying', dataLength: 10, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  lang: string;

  @property({
    type: 'string',
    postgresql: {columnName: 'comment', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  comment?: string;

  @property({
    type: 'date',
    jsonSchema: { nullable: true },
    postgresql: {columnName: 'translationdate', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  translationdate?: string;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    id: 1,
    postgresql: {columnName: 'id', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  id: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //[prop: string]: any;

  constructor(data?: Partial<CommentTranslation>) {
    super(data);
  }
}

export interface CommentTranslationRelations {
  // describe navigational properties here
}

export type CommentTranslationWithRelations = CommentTranslation & CommentTranslationRelations;
