import {inject} from '@loopback/core';
import {MicadoDsDataSource} from '../datasources';
import {PictureHotspotTranslation, PictureHotspotTranslationRelations} from '../models';
import {BaseTranslationRepository} from './base-translation.repository';

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

  public getTranslatableColumnNames(): Array<string> {
    return ['title', 'message'];
  }
}
