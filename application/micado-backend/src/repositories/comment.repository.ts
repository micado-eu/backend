import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Comment, CommentRelations, CommentTranslation} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CommentTranslationRepository} from './comment-translation.repository';

export class CommentRepository extends DefaultCrudRepository<
  Comment,
  typeof Comment.prototype.id,
  CommentRelations
> {

  public readonly translations: HasManyRepositoryFactory<CommentTranslation, typeof Comment.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('CommentTranslationRepository') protected commentTranslationRepositoryGetter: Getter<CommentTranslationRepository>,
  ) {
    super(Comment, dataSource);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', commentTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
