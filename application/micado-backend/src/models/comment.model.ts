import {Entity, model, property, hasMany} from '@loopback/repository';
import {CommentTranslation} from './comment-translation.model';

@model({
  settings: {idInjection: false, postgresql: {schema: 'micadoapp', table: 'comment'}}
})
export class Comment extends Entity {
  @property({
    type: 'boolean',
    postgresql: {columnName: 'published', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  published?: boolean;

  @property({
    type: 'date',
    jsonSchema: { nullable: true },
    postgresql: {columnName: 'publicationdate', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  publicationdate?: string;

  @property({
    type: 'number',
    required: false,
    scale: 0,
    id: 1,
    generated:true,
    postgresql: {columnName: 'id', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  id: number;

  @hasMany(() => CommentTranslation, {keyTo: 'id'})
  translations: CommentTranslation[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //[prop: string]: any;

  constructor(data?: Partial<Comment>) {
    super(data);
  }
}

export interface CommentRelations {
  // describe navigational properties here
}

export type CommentWithRelations = Comment & CommentRelations;
