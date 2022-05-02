import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {MicadoDsDataSource} from '../datasources';
import {Userone, UserRelations, IndividualInterventionPlan, UserPictures, UserPreferences, UserConsent} from '../models';
import {IndividualInterventionPlanRepository} from './individual-intervention-plan.repository';
import {UserPicturesRepository} from './user-pictures.repository';
import {UserPreferencesRepository} from './user-preferences.repository';
import {UserConsentRepository} from './user-consent.repository';

export class UserRepositoryOne extends DefaultCrudRepository<
Userone,
  typeof Userone.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('IndividualInterventionPlanRepository') protected individualInterventionPlanRepositoryGetter: Getter<IndividualInterventionPlanRepository>, @repository.getter('UserPicturesRepository') protected userPicturesRepositoryGetter: Getter<UserPicturesRepository>, @repository.getter('UserPreferencesRepository') protected userPreferencesRepositoryGetter: Getter<UserPreferencesRepository>, @repository.getter('UserConsentRepository') protected userConsentRepositoryGetter: Getter<UserConsentRepository>,
  ) {
    super(Userone, dataSource);
    
  }
}
