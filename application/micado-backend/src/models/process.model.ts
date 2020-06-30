import { Entity, model, property, hasMany } from '@loopback/repository';
import { ProcessTranslation } from './process-translation.model';
import { ProcessUsers } from './process-users.model';
import { ProcessTopic } from './process-topic.model';

@model({
  settings: { idInjection: false, postgresql: { schema: 'micadoapp', table: 'process' } }
})
export class Process extends Entity {
  @property({
    type: 'number',
    required: false,
    scale: 0,
    id: 1,
    generated: true,
    postgresql: { columnName: 'id', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO' },
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
    postgresql: { columnName: 'publication_date', dataType: 'timestamp without time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  publicationDate?: string;

  @hasMany(() => ProcessTranslation, { keyTo: 'id' })
  translations: ProcessTranslation[];

  @hasMany(() => ProcessUsers, { keyTo: 'idProcess' })
  applicableUsers: ProcessUsers[];

  @hasMany(() => ProcessTopic, { keyTo: 'idProcess' })
  processTopics: ProcessTopic[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //  [prop: string]: any;

  constructor(data?: Partial<Process>) {
    super(data);
  }
}

export interface ProcessRelations {
  // describe navigational properties here
}

export type ProcessWithRelations = Process & ProcessRelations;
