import { DefaultCrudRepository, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { EventCategory, EventCategoryRelations, EventCategoryTranslation } from '../models';
import { MicadoDsDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { EventCategoryTranslationRepository } from './event-category-translation.repository';

export class EventCategoryRepository extends DefaultCrudRepository<
  EventCategory,
  typeof EventCategory.prototype.id,
  EventCategoryRelations
  > {
  public readonly orders: HasManyRepositoryFactory<
    EventCategoryTranslation,
    typeof EventCategory.prototype.id
  >;

  public readonly translations: HasManyRepositoryFactory<EventCategoryTranslation, typeof EventCategory.prototype.id>;
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
    @repository.getter('EventTranslationRepository') getEventCategoryTranslationRepository: Getter<EventCategoryTranslationRepository>,
    @repository.getter('EventTranslationRepository') protected eventCategoryTranslationRepositoryGetter: Getter<EventCategoryTranslationRepository>,
  ) {
    super(EventCategory, dataSource);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', eventCategoryTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
