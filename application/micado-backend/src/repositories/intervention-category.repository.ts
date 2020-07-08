import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {InterventionCategory, InterventionCategoryRelations, InterventionCategoryTranslation} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {InterventionCategoryTranslationRepository} from './intervention-category-translation.repository';

export class InterventionCategoryRepository extends DefaultCrudRepository<
  InterventionCategory,
  typeof InterventionCategory.prototype.id,
  InterventionCategoryRelations
> {

  public readonly translations: HasManyRepositoryFactory<InterventionCategoryTranslation, typeof InterventionCategory.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('InterventionCategoryTranslationRepository') protected interventionCategoryTranslationRepositoryGetter: Getter<InterventionCategoryTranslationRepository>,
  ) {
    super(InterventionCategory, dataSource);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', interventionCategoryTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
