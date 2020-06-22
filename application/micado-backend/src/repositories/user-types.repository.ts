import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {UserTypes, UserTypesRelations, UserTypesTranslation} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserTypesTranslationRepository} from './user-types-translation.repository';

export class UserTypesRepository extends DefaultCrudRepository<
  UserTypes,
  typeof UserTypes.prototype.id,
  UserTypesRelations
> {

  public readonly translations: HasManyRepositoryFactory<UserTypesTranslation, typeof UserTypes.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('UserTypesTranslationRepository') protected userTypesTranslationRepositoryGetter: Getter<UserTypesTranslationRepository>,
  ) {
    super(UserTypes, dataSource);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', userTypesTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
