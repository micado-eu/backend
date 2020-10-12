import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {IndividualInterventionPlanInterventions, IndividualInterventionPlanInterventionsRelations, IndividualInterventionPlan} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {IndividualInterventionPlanRepository} from './individual-intervention-plan.repository';

export class IndividualInterventionPlanInterventionsRepository extends DefaultCrudRepository<
  IndividualInterventionPlanInterventions,
  typeof IndividualInterventionPlanInterventions.prototype.id,
  IndividualInterventionPlanInterventionsRelations
> {

  public readonly interventionPlan: HasOneRepositoryFactory<IndividualInterventionPlan, typeof IndividualInterventionPlanInterventions.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('IndividualInterventionPlanRepository') protected individualInterventionPlanRepositoryGetter: Getter<IndividualInterventionPlanRepository>,
  ) {
    super(IndividualInterventionPlanInterventions, dataSource);
    this.interventionPlan = this.createHasOneRepositoryFactoryFor('interventionPlan', individualInterventionPlanRepositoryGetter);
    this.registerInclusionResolver('interventionPlan', this.interventionPlan.inclusionResolver);
  }
}
