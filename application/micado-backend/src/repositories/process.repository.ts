import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Process, ProcessRelations, ProcessTranslation, ProcessUsers, ProcessTopic} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProcessTranslationRepository} from './process-translation.repository';
import {ProcessUsersRepository} from './process-users.repository';
import {ProcessTopicRepository} from './process-topic.repository';

export class ProcessRepository extends DefaultCrudRepository<
  Process,
  typeof Process.prototype.id,
  ProcessRelations
> {

  public readonly translations: HasManyRepositoryFactory<ProcessTranslation, typeof Process.prototype.id>;

  public readonly applicableUsers: HasManyRepositoryFactory<ProcessUsers, typeof Process.prototype.id>;

  public readonly processTopics: HasManyRepositoryFactory<ProcessTopic, typeof Process.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('ProcessTranslationRepository') protected processTranslationRepositoryGetter: Getter<ProcessTranslationRepository>, @repository.getter('ProcessUsersRepository') protected processUsersRepositoryGetter: Getter<ProcessUsersRepository>, @repository.getter('ProcessTopicRepository') protected processTopicRepositoryGetter: Getter<ProcessTopicRepository>,
  ) {
    super(Process, dataSource);
    this.processTopics = this.createHasManyRepositoryFactoryFor('processTopics', processTopicRepositoryGetter,);
    this.registerInclusionResolver('processTopics', this.processTopics.inclusionResolver);
    this.applicableUsers = this.createHasManyRepositoryFactoryFor('applicableUsers', processUsersRepositoryGetter,);
    this.registerInclusionResolver('applicableUsers', this.applicableUsers.inclusionResolver);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', processTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
