import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, UserAttribute} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserAttributeRepository} from './user-attribute.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.umId,
  UserRelations
> {

  public readonly attributes: HasManyRepositoryFactory<UserAttribute, typeof User.prototype.umId>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('UserAttributeRepository') protected userAttributeRepositoryGetter: Getter<UserAttributeRepository>,
  ) {
    super(User, dataSource);
    this.attributes = this.createHasManyRepositoryFactoryFor('attributes', userAttributeRepositoryGetter,);
    this.registerInclusionResolver('attributes', this.attributes.inclusionResolver);
  }
}
