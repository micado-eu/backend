import {Model, model, property} from '@loopback/repository';

@model()
export class TenantMgtAdminService extends Model {

  constructor(data?: Partial<TenantMgtAdminService>) {
    super(data);
  }
}

export interface TenantMgtAdminServiceRelations {
  // describe navigational properties here
}

export type TenantMgtAdminServiceWithRelations = TenantMgtAdminService & TenantMgtAdminServiceRelations;
