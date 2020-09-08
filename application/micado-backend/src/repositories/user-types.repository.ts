import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {UserTypes, UserTypesRelations, UserTypesTranslation, UserTypesTranslationProd} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserTypesTranslationRepository} from './user-types-translation.repository';
import {UserTypesTranslationProdRepository} from './user-types-translation-prod.repository';

export class UserTypesRepository extends DefaultCrudRepository<
  UserTypes,
  typeof UserTypes.prototype.id,
  UserTypesRelations
> {

  public readonly translations: HasManyRepositoryFactory<UserTypesTranslation, typeof UserTypes.prototype.id>;

  public readonly translations_prod: HasManyRepositoryFactory<UserTypesTranslationProd, typeof UserTypes.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('UserTypesTranslationRepository') protected userTypesTranslationRepositoryGetter: Getter<UserTypesTranslationRepository>, @repository.getter('UserTypesTranslationProdRepository') protected userTypesTranslationProdRepositoryGetter: Getter<UserTypesTranslationProdRepository>,
  ) {
    super(UserTypes, dataSource);
    this.translations_prod = this.createHasManyRepositoryFactoryFor('translations_prod', userTypesTranslationProdRepositoryGetter,);
    this.registerInclusionResolver('translations_prod', this.translations_prod.inclusionResolver);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', userTypesTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
