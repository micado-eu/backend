import {DefaultCrudRepository} from '@loopback/repository';
import {CommentsTranslation, CommentsTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CommentsTranslationRepository extends DefaultCrudRepository<
  CommentsTranslation,
  typeof CommentsTranslation.prototype.lang,
  CommentsTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(CommentsTranslation, dataSource);
  }
}
