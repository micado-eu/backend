import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {MicadoDsDataSource} from '../datasources';
import {User, UserRelations, IndividualInterventionPlan, UserPictures, UserPreferences, UserConsent, Tenant} from '../models';
import {IndividualInterventionPlanRepository} from './individual-intervention-plan.repository';
import {UserPicturesRepository} from './user-pictures.repository';
import {UserPreferencesRepository} from './user-preferences.repository';
import {UserConsentRepository} from './user-consent.repository';
import {TenantRepository} from './tenant.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly interventionPlans: HasManyRepositoryFactory<IndividualInterventionPlan, typeof User.prototype.id>;

  public readonly userPicture: HasOneRepositoryFactory<UserPictures, typeof User.prototype.id>;

  public readonly userPreferences: HasManyRepositoryFactory<UserPreferences, typeof User.prototype.id>;

  public readonly userConsent: HasOneRepositoryFactory<UserConsent, typeof User.prototype.id>;

  public readonly tenant: HasOneRepositoryFactory<Tenant, typeof User.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('IndividualInterventionPlanRepository') protected individualInterventionPlanRepositoryGetter: Getter<IndividualInterventionPlanRepository>, @repository.getter('UserPicturesRepository') protected userPicturesRepositoryGetter: Getter<UserPicturesRepository>, @repository.getter('UserPreferencesRepository') protected userPreferencesRepositoryGetter: Getter<UserPreferencesRepository>, @repository.getter('UserConsentRepository') protected userConsentRepositoryGetter: Getter<UserConsentRepository>, @repository.getter('TenantRepository') protected tenantRepositoryGetter: Getter<TenantRepository>,
  ) {
    super(User, dataSource);
    this.tenant = this.createHasOneRepositoryFactoryFor('tenant', tenantRepositoryGetter);
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
    this.userConsent = this.createHasOneRepositoryFactoryFor('userConsent', userConsentRepositoryGetter);
    this.registerInclusionResolver('userConsent', this.userConsent.inclusionResolver);
    this.userPreferences = this.createHasManyRepositoryFactoryFor('userPreferences', userPreferencesRepositoryGetter,);
    this.registerInclusionResolver('userPreferences', this.userPreferences.inclusionResolver);
    this.userPicture = this.createHasOneRepositoryFactoryFor('userPicture', userPicturesRepositoryGetter);
    this.registerInclusionResolver('userPicture', this.userPicture.inclusionResolver);
    this.interventionPlans = this.createHasManyRepositoryFactoryFor('interventionPlans', individualInterventionPlanRepositoryGetter,);
    this.registerInclusionResolver('interventionPlans', this.interventionPlans.inclusionResolver);
  }
}
