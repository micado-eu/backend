import {DefaultCrudRepository} from '@loopback/repository';
import {InterventionCategory, InterventionCategoryRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InterventionCategoryRepository extends DefaultCrudRepository<
  InterventionCategory,
  typeof InterventionCategory.prototype.id,
  InterventionCategoryRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(InterventionCategory, dataSource);
  }
}
