import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MicadoDsDataSource} from '../datasources';
import {AuthUser, AuthUserRelations} from '../models';

export class AuthUserRepository extends DefaultCrudRepository<
  AuthUser,
  typeof AuthUser.prototype.id,
  AuthUserRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(AuthUser, dataSource);
  }
}
