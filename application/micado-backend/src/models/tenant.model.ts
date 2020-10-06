import { Entity, model, property, hasMany} from '@loopback/repository';


@model({
  settings: { idInjection: false, postgresql: { schema: 'wso2_shared', table: 'um_tenant' } }
})
export class Tenant extends Entity {
  @property({
    type: 'number',
    scale: 0,
    id: true,
    postgresql: { columnName: 'um_id', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO' },
  })
  umId?: number;

  @property({
    type: 'string',
    length: 255,
    postgresql: { columnName: 'um_domain_name', dataType: 'character varying', dataLength: 255, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  umDomainName?: string;

  @property({
    type: 'string',
    length: 255,
    postgresql: { columnName: 'um_email', dataType: 'character varying', dataLength: 255, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  umEmail?: string;


  @property({
    type: 'boolean',
    postgresql: { columnName: 'um_active', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  umActive?: boolean;

  @property({
    type: 'date',
    postgresql: { columnName: 'um_created_date', dataType: 'timestamp without time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES' },
  })
  umCreatedDate?: string;

  @property({
    type: 'string',
    scale: 0,
    postgresql: { columnName: 'um_user_config', dataType: 'text', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES' },
  })
  umUserConfig?: number;

 
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
 // [prop: string]: any;

  constructor(data?: Partial<Tenant>) {
    super(data);
  }
}

export interface TenantRelations {
  // describe navigational properties here
}

export type TenantWithRelations = Tenant & TenantRelations;