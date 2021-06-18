import {DefaultCrudRepository} from '@loopback/repository';
import {TSettingsTranslation, TSettingsTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import { BaseTranslationRepository } from './base-translation.repository';

export class TSettingsTranslationRepository extends BaseTranslationRepository<
  TSettingsTranslation,
  typeof TSettingsTranslation.prototype.id,
  TSettingsTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(TSettingsTranslation, dataSource);
  }

  getTranslatableColumnNames(): Array<string> {
    return ['value'];
  }

  public getProdModelName(): string {
    return 'TSettingsTranslationProd'
  }

  public getProdModelModuleName(): string {
    return 't-settings-translation-prod';
  }

  public getProdModelTableName(): string {
    return 't_settings_translation_prod';
  }
}
