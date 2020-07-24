import {DefaultCrudRepository} from '@loopback/repository';
import {IndividualInterventionPlanInterventions, IndividualInterventionPlanInterventionsRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class IndividualInterventionPlanInterventionsRepository extends DefaultCrudRepository<
  IndividualInterventionPlanInterventions,
  typeof IndividualInterventionPlanInterventions.prototype.id,
  IndividualInterventionPlanInterventionsRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(IndividualInterventionPlanInterventions, dataSource);
  }
}
