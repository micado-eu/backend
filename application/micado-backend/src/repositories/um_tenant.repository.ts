import {DefaultCrudRepository} from '@loopback/repository';
import {Um_Tenant, Um_TenantRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class Um_TenantRepository extends DefaultCrudRepository<
Um_Tenant,
  typeof Um_Tenant.prototype.umId,
  Um_TenantRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(Um_Tenant, dataSource);
  }
}
