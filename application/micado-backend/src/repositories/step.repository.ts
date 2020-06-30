import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Step, StepRelations, StepTranslation, StepDocument} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {StepTranslationRepository} from './step-translation.repository';
import {StepDocumentRepository} from './step-document.repository';

export class StepRepository extends DefaultCrudRepository<
  Step,
  typeof Step.prototype.id,
  StepRelations
> {

  public readonly translations: HasManyRepositoryFactory<StepTranslation, typeof Step.prototype.id>;

  public readonly documents: HasManyRepositoryFactory<StepDocument, typeof Step.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('StepTranslationRepository') protected stepTranslationRepositoryGetter: Getter<StepTranslationRepository>, @repository.getter('StepDocumentRepository') protected stepDocumentRepositoryGetter: Getter<StepDocumentRepository>,
  ) {
    super(Step, dataSource);
    this.documents = this.createHasManyRepositoryFactoryFor('documents', stepDocumentRepositoryGetter,);
    this.registerInclusionResolver('documents', this.documents.inclusionResolver);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', stepTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
