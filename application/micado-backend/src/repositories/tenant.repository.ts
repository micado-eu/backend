import {DefaultCrudRepository} from '@loopback/repository';
import {Tenant, TenantRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TenantRepository extends DefaultCrudRepository<
  Tenant,
  typeof Tenant.prototype.umId,
  TenantRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(Tenant, dataSource);
  }
}
