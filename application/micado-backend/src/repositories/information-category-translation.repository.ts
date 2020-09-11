import {DefaultCrudRepository} from '@loopback/repository';
import {InformationCategoryTranslation, InformationCategoryTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InformationCategoryTranslationRepository extends DefaultCrudRepository<
  InformationCategoryTranslation,
  typeof InformationCategoryTranslation.prototype.id,
  InformationCategoryTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(InformationCategoryTranslation, dataSource);
  }
}
