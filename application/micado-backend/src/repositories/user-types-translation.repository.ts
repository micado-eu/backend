import {DefaultCrudRepository} from '@loopback/repository';
import {UserTypesTranslation, UserTypesTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserTypesTranslationRepository extends DefaultCrudRepository<
  UserTypesTranslation,
  typeof UserTypesTranslation.prototype.id,
  UserTypesTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(UserTypesTranslation, dataSource);
  }
}
