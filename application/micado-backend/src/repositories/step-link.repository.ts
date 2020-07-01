import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {StepLink, StepLinkRelations, StepLinkTranslation} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {StepLinkTranslationRepository} from './step-link-translation.repository';

export class StepLinkRepository extends DefaultCrudRepository<
  StepLink,
  typeof StepLink.prototype.id,
  StepLinkRelations
> {

  public readonly translations: HasManyRepositoryFactory<StepLinkTranslation, typeof StepLink.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('StepLinkTranslationRepository') protected stepLinkTranslationRepositoryGetter: Getter<StepLinkTranslationRepository>,
  ) {
    super(StepLink, dataSource);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', stepLinkTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
