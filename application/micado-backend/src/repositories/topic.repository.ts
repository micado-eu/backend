import { DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { TopicTranslation, Topic, TopicRelations } from '../models';
import { MicadoDsDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { TopicTranslationRepository } from './topic-translation.repository'

export class TopicRepository extends DefaultCrudRepository<
  Topic,
  typeof Topic.prototype.id,
  TopicRelations
  > {
  public readonly orders: HasManyRepositoryFactory<
    TopicTranslation,
    typeof Topic.prototype.id
  >;

  public readonly translations: HasManyRepositoryFactory<TopicTranslation, typeof Topic.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
    @repository.getter('TopicTranslationRepository') getTopicTranslationRepository: Getter<TopicTranslationRepository>, @repository.getter('TopicTranslationRepository') protected topicTranslationRepositoryGetter: Getter<TopicTranslationRepository>,
  ) {
    super(Topic, dataSource);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', topicTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
    /*
        this.translations = this.createHasManyRepositoryFactoryFor(
          'translations',
          getTopicTranslationRepository,
        );
        */
  }
}
