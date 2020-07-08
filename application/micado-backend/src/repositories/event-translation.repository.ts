import {DefaultCrudRepository} from '@loopback/repository';
import {EventTranslation, EventTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class EventTranslationRepository extends DefaultCrudRepository<
  EventTranslation,
  typeof EventTranslation.prototype.id,
  EventTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(EventTranslation, dataSource);
  }
}
