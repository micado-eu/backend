import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Comments, CommentsRelations, CommentsTranslation} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CommentsTranslationRepository} from './comments-translation.repository';

export class CommentsRepository extends DefaultCrudRepository<
  Comments,
  typeof Comments.prototype.id,
  CommentsRelations
> {

  public readonly translations: HasManyRepositoryFactory<CommentsTranslation, typeof Comments.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('CommentsTranslationRepository') protected commentsTranslationRepositoryGetter: Getter<CommentsTranslationRepository>,
  ) {
    super(Comments, dataSource);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', commentsTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
