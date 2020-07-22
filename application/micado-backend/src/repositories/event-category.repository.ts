import { DefaultCrudRepository, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { EventCategory, EventCategoryRelations, EventCategoryTranslation } from '../models';
import { MicadoDsDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { EventCategoryTranslationRepository } from '.';

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
    @repository.getter('EventCategoryTranslationRepository') getEventCategoryTranslationRepository: Getter<EventCategoryTranslationRepository>,
    @repository.getter('EventCategoryTranslationRepository') protected eventCategoryTranslationRepositoryGetter: Getter<EventCategoryTranslationRepository>,
  ) {
    super(EventCategory, dataSource);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', eventCategoryTranslationRepositoryGetter);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
