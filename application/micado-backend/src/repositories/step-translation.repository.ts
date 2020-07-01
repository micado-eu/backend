import {DefaultCrudRepository} from '@loopback/repository';
import {StepTranslation, StepTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StepTranslationRepository extends DefaultCrudRepository<
  StepTranslation,
  typeof StepTranslation.prototype.id,
  StepTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(StepTranslation, dataSource);
  }
}
