import {DefaultCrudRepository} from '@loopback/repository';
import {StepLink, StepLinkRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StepLinkRepository extends DefaultCrudRepository<
  StepLink,
  typeof StepLink.prototype.id,
  StepLinkRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(StepLink, dataSource);
  }
}
