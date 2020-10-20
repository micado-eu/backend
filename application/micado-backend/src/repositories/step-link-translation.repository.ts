import {DefaultCrudRepository} from '@loopback/repository';
import {StepLinkTranslation, StepLinkTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import { BaseTranslationRepository } from './base-translation.repository';

export class StepLinkTranslationRepository extends BaseTranslationRepository<
  StepLinkTranslation,
  typeof StepLinkTranslation.prototype.id,
  StepLinkTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(StepLinkTranslation, dataSource);
  }

  getTranslatableColumnName(): string {
    return 'description';
  }
}
