import {DefaultCrudRepository} from '@loopback/repository';
import {StepLinkTranslation, StepLinkTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StepLinkTranslationRepository extends DefaultCrudRepository<
  StepLinkTranslation,
  typeof StepLinkTranslation.prototype.id,
  StepLinkTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(StepLinkTranslation, dataSource);
  }
}
