import { DefaultCrudRepository, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { TopicTranslation, Topic, TopicRelations, TopicTranslationProd} from '../models';
import { MicadoDsDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { TopicTranslationRepository } from './topic-translation.repository'
import {TopicTranslationProdRepository} from './topic-translation-prod.repository';

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

  public readonly translations_prod: HasManyRepositoryFactory<TopicTranslationProd, typeof Topic.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
    @repository.getter('TopicTranslationRepository') getTopicTranslationRepository: Getter<TopicTranslationRepository>, @repository.getter('TopicTranslationRepository') protected topicTranslationRepositoryGetter: Getter<TopicTranslationRepository>, @repository.getter('TopicTranslationProdRepository') protected topicTranslationProdRepositoryGetter: Getter<TopicTranslationProdRepository>,
  ) {
    super(Topic, dataSource);
    this.translations_prod = this.createHasManyRepositoryFactoryFor('translations_prod', topicTranslationProdRepositoryGetter,);
    this.registerInclusionResolver('translations_prod', this.translations_prod.inclusionResolver);
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
