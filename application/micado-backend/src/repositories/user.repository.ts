import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, UserAttribute, IndividualInterventionPlan, Tenant} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserAttributeRepository} from './user-attribute.repository';
import {IndividualInterventionPlanRepository} from './individual-intervention-plan.repository';
import {TenantRepository} from './tenant.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.umId,
  UserRelations
> {

  public readonly attributes: HasManyRepositoryFactory<UserAttribute, typeof User.prototype.umId>;

  public readonly interventionPlans: HasManyRepositoryFactory<IndividualInterventionPlan, typeof User.prototype.umId>;

  public readonly tenant: HasOneRepositoryFactory<Tenant, typeof User.prototype.umId>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('UserAttributeRepository') protected userAttributeRepositoryGetter: Getter<UserAttributeRepository>, @repository.getter('IndividualInterventionPlanRepository') protected individualInterventionPlanRepositoryGetter: Getter<IndividualInterventionPlanRepository>, @repository.getter('TenantRepository') protected tenantRepositoryGetter: Getter<TenantRepository>,
  ) {
    super(User, dataSource);
    this.tenant = this.createHasOneRepositoryFactoryFor('tenant', tenantRepositoryGetter);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
    this.interventionPlans = this.createHasManyRepositoryFactoryFor('interventionPlans', individualInterventionPlanRepositoryGetter,);
    this.registerInclusionResolver('interventionPlans', this.interventionPlans.inclusionResolver);
    this.attributes = this.createHasManyRepositoryFactoryFor('attributes', userAttributeRepositoryGetter,);
    this.registerInclusionResolver('attributes', this.attributes.inclusionResolver);
  }
}
