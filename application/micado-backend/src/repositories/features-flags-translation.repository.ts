import {DefaultCrudRepository} from '@loopback/repository';
import {FeaturesFlagsTranslation, FeaturesFlagsTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class FeaturesFlagsTranslationRepository extends DefaultCrudRepository<
  FeaturesFlagsTranslation,
  typeof FeaturesFlagsTranslation.prototype.id,
  FeaturesFlagsTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(FeaturesFlagsTranslation, dataSource);
  }
}
