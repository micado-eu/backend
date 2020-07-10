import {DefaultCrudRepository} from '@loopback/repository';
import {CommentTranslation, CommentTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CommentTranslationRepository extends DefaultCrudRepository<
  CommentTranslation,
  typeof CommentTranslation.prototype.lang,
  CommentTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(CommentTranslation, dataSource);
  }
}
