import {DefaultCrudRepository} from '@loopback/repository';
import {DocumentTypeTranslation, DocumentTypeTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DocumentTypeTranslationRepository extends DefaultCrudRepository<
  DocumentTypeTranslation,
  typeof DocumentTypeTranslation.prototype.id,
  DocumentTypeTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(DocumentTypeTranslation, dataSource);
  }
}
