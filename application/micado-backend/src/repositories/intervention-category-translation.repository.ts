import {DefaultCrudRepository} from '@loopback/repository';
import {InterventionCategoryTranslation, InterventionCategoryTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InterventionCategoryTranslationRepository extends DefaultCrudRepository<
  InterventionCategoryTranslation,
  typeof InterventionCategoryTranslation.prototype.id,
  InterventionCategoryTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(InterventionCategoryTranslation, dataSource);
  }
}
