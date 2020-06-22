import {DefaultCrudRepository} from '@loopback/repository';
import {ProcessTranslation, ProcessTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProcessTranslationRepository extends DefaultCrudRepository<
  ProcessTranslation,
  typeof ProcessTranslation.prototype.id,
  ProcessTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(ProcessTranslation, dataSource);
  }
}
