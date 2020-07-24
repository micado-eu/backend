import { DefaultCrudRepository, HasManyRepositoryFactory, repository, Filter } from '@loopback/repository';
import { Event, EventRelations, EventTranslation, EventTag } from '../models';
import { MicadoDsDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { EventTranslationRepository } from '.';
import { EventTagRepository } from './event-tag.repository';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype.id,
  EventRelations
  > {
  public readonly ordersTranslations: HasManyRepositoryFactory<
    EventTranslation,
    typeof Event.prototype.id
  >;
  public readonly ordersTags: HasManyRepositoryFactory<EventTag, typeof Event.prototype.id>;

  public readonly translations: HasManyRepositoryFactory<EventTranslation, typeof Event.prototype.id>;
  public readonly tags: HasManyRepositoryFactory<EventTag, typeof Event.prototype.id>;
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
    @repository.getter('EventTranslationRepository') getEventTranslationRepository: Getter<EventTranslationRepository>,
    @repository.getter('EventTranslationRepository') protected eventTranslationRepositoryGetter: Getter<EventTranslationRepository>,
    @repository.getter('EventTagRepository') getEventTagRepository: Getter<EventTagRepository>,
    @repository.getter('EventTagRepository') protected eventTagRepositoryGetter: Getter<EventTagRepository>,
  ) {
    super(Event, dataSource);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', eventTranslationRepositoryGetter,);
    this.tags = this.createHasManyRepositoryFactoryFor('tags', eventTagRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
    this.registerInclusionResolver('tags', this.tags.inclusionResolver);
  }

  async findPublished(filter?: Filter<Event>) {
    let combinedFilters = { where: { published: true } }
    if (filter) {
      combinedFilters = { ...filter, ...combinedFilters }
    }
    return await this.find(combinedFilters)
  }
}
