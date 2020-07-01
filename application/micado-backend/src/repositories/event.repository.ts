import {DefaultCrudRepository} from '@loopback/repository';
import {Event, EventRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype.id,
  EventRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(Event, dataSource);
  }
}
