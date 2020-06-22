import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {InterventionTypes, InterventionTypesRelations, InterventionTypesTranslation} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {InterventionTypesTranslationRepository} from './intervention-types-translation.repository';

export class InterventionTypesRepository extends DefaultCrudRepository<
  InterventionTypes,
  typeof InterventionTypes.prototype.id,
  InterventionTypesRelations
> {

  public readonly translations: HasManyRepositoryFactory<InterventionTypesTranslation, typeof InterventionTypes.prototype.id>;


  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('InterventionTypesTranslationRepository') protected interventionTypesTranslationRepositoryGetter: Getter<InterventionTypesTranslationRepository>,
  ) {
    super(InterventionTypes, dataSource);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', interventionTypesTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
