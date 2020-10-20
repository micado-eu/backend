import {DefaultCrudRepository} from '@loopback/repository';
import {PictureHotspotTranslation, PictureHotspotTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import { BaseTranslationRepository } from './base-translation.repository';

export class PictureHotspotTranslationRepository extends BaseTranslationRepository<
  PictureHotspotTranslation,
  typeof PictureHotspotTranslation.prototype.phtId,
  PictureHotspotTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(PictureHotspotTranslation, dataSource);
  }

  getIdColumnName(): string {
    return 'pht_id';
  }

  getTranslatableColumnName(): string {
    return 'message';
  }
}
