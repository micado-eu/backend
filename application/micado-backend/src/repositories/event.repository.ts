import { DefaultCrudRepository, HasManyRepositoryFactory, repository, Filter } from '@loopback/repository';
import { Event, EventRelations, EventTranslation } from '../models';
import { MicadoDsDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { EventTranslationRepository } from '.';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype.id,
  EventRelations
  > {
  public readonly orders: HasManyRepositoryFactory<
    EventTranslation,
    typeof Event.prototype.id
  >;

  public readonly translations: HasManyRepositoryFactory<EventTranslation, typeof Event.prototype.id>;
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
    @repository.getter('EventTranslationRepository') getEventTranslationRepository: Getter<EventTranslationRepository>,
    @repository.getter('EventTranslationRepository') protected eventTranslationRepositoryGetter: Getter<EventTranslationRepository>,
  ) {
    super(Event, dataSource);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', eventTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }

  async findPublished(filter?: Filter<Event>) {
    let combinedFilters = { where: { published: true } }
    if (filter) {
      combinedFilters = { ...filter, ...combinedFilters }
    }
    return await this.find(combinedFilters)
  }
}
