import {DefaultCrudRepository} from '@loopback/repository';
import {StepIcon, StepIconRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class StepIconRepository extends DefaultCrudRepository<
  StepIcon,
  typeof StepIcon.prototype.id,
  StepIconRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(StepIcon, dataSource);
  }
}
