import {DefaultCrudRepository} from '@loopback/repository';
import {InterventionTypesTranslation, InterventionTypesTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InterventionTypesTranslationRepository extends DefaultCrudRepository<
  InterventionTypesTranslation,
  typeof InterventionTypesTranslation.prototype.id,
  InterventionTypesTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(InterventionTypesTranslation, dataSource);
  }
}
