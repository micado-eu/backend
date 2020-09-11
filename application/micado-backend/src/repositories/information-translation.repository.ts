import {DefaultCrudRepository} from '@loopback/repository';
import {InformationTranslation, InformationTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InformationTranslationRepository extends DefaultCrudRepository<
  InformationTranslation,
  typeof InformationTranslation.prototype.id,
  InformationTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(InformationTranslation, dataSource);
  }
}
