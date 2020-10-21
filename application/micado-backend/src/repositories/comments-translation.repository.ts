import {DefaultCrudRepository} from '@loopback/repository';
import {CommentsTranslation, CommentsTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import { BaseTranslationRepository } from './base-translation.repository';

export class CommentsTranslationRepository extends BaseTranslationRepository<
  CommentsTranslation,
  typeof CommentsTranslation.prototype.lang,
  CommentsTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(CommentsTranslation, dataSource);
  }

  getTranslatableColumnNames(): Array<string> {
    return ['comment'];
  }
}
