import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MicadoDsDataSource} from '../datasources';
import {UserEntity, UserEntityRelations} from '../models';

export class UserEntityRepository extends DefaultCrudRepository<
  UserEntity,
  typeof UserEntity.prototype.id,
  UserEntityRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(UserEntity, dataSource);
  }
}
