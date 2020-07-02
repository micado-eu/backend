import {DefaultCrudRepository} from '@loopback/repository';
import {GlossaryTranslation, GlossaryTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class GlossaryTranslationRepository extends DefaultCrudRepository<
  GlossaryTranslation,
  typeof GlossaryTranslation.prototype.id,
  GlossaryTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(GlossaryTranslation, dataSource);
  }
}
