import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'micadoapp', table: 'individual_intervention_plan_interventions'}
  }
})
export class IndividualInterventionPlanInterventions extends Entity {
  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {columnName: 'list_id', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  listId: number;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {columnName: 'intervention_type', dataType: 'smallint', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  interventionType: number;

  @property({
    type: 'date',
    jsonSchema: { nullable: true },
    postgresql: {columnName: 'validation_date', dataType: 'timestamp without time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  validationDate?: string;

  @property({
    type: 'boolean',
    postgresql: {columnName: 'completed', dataType: 'boolean', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  completed?: boolean;

  @property({
    type: 'number',
    scale: 0,
    postgresql: {columnName: 'validating_user_id', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES'},
  })
  validatingUserId?: number;

  @property({
    type: 'number',
    scale: 0,
    postgresql: {columnName: 'validating_user_tenant', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES'},
  })
  validatingUserTenant?: number;

  @property({
    type: 'date',
    postgresql: {columnName: 'assignment_date', dataType: 'timestamp without time zone', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  assignmentDate?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<IndividualInterventionPlanInterventions>) {
    super(data);
  }
}

export interface IndividualInterventionPlanInterventionsRelations {
  // describe navigational properties here
}

export type IndividualInterventionPlanInterventionsWithRelations = IndividualInterventionPlanInterventions & IndividualInterventionPlanInterventionsRelations;
