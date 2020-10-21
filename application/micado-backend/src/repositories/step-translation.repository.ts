import {DefaultCrudRepository} from '@loopback/repository';
import {StepTranslation, StepTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';
import { BaseTranslationRepository } from './base-translation.repository';

export class StepTranslationRepository extends BaseTranslationRepository<
  StepTranslation,
  typeof StepTranslation.prototype.id,
  StepTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(StepTranslation, dataSource);
  }

  public getTranslatableColumnNames(): Array<string> {
    return ['step', 'description'];
  }
}
