import {DefaultCrudRepository} from '@loopback/repository';
import {PictureHotspotTranslation, PictureHotspotTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PictureHotspotTranslationRepository extends DefaultCrudRepository<
  PictureHotspotTranslation,
  typeof PictureHotspotTranslation.prototype.phtId,
  PictureHotspotTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(PictureHotspotTranslation, dataSource);
  }
}
