import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {InterventionTypes, InterventionTypesRelations, InterventionTypesTranslation, InterventionTypeValidator} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {InterventionTypesTranslationRepository} from './intervention-types-translation.repository';
import {InterventionTypeValidatorRepository} from './intervention-type-validator.repository';

export class InterventionTypesRepository extends DefaultCrudRepository<
  InterventionTypes,
  typeof InterventionTypes.prototype.id,
  InterventionTypesRelations
> {

  public readonly translations: HasManyRepositoryFactory<InterventionTypesTranslation, typeof InterventionTypes.prototype.id>;

  public readonly interventionTypeValidators: HasManyRepositoryFactory<InterventionTypeValidator, typeof InterventionTypes.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('InterventionTypesTranslationRepository') protected interventionTypesTranslationRepositoryGetter: Getter<InterventionTypesTranslationRepository>, @repository.getter('InterventionTypeValidatorRepository') protected interventionTypeValidatorRepositoryGetter: Getter<InterventionTypeValidatorRepository>,
  ) {
    super(InterventionTypes, dataSource);
    this.interventionTypeValidators = this.createHasManyRepositoryFactoryFor('interventionTypeValidators', interventionTypeValidatorRepositoryGetter,);
    this.registerInclusionResolver('interventionTypeValidators', this.interventionTypeValidators.inclusionResolver);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', interventionTypesTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
