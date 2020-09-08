import { DefaultCrudRepository, HasManyRepositoryFactory, repository, Filter } from '@loopback/repository';
import { Event, EventRelations, EventTranslation, EventTranslationProd} from '../models';
import { MicadoDsDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { EventTranslationRepository } from '.';
import {EventTranslationProdRepository} from './event-translation-prod.repository';

export class EventRepository extends DefaultCrudRepository<
  Event,
  typeof Event.prototype.id,
  EventRelations
  > {
  public readonly ordersTranslations: HasManyRepositoryFactory<
    EventTranslation,
    typeof Event.prototype.id
  >;

  public readonly translations: HasManyRepositoryFactory<EventTranslation, typeof Event.prototype.id>;

  public readonly translations_prod: HasManyRepositoryFactory<EventTranslationProd, typeof Event.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
    @repository.getter('EventTranslationRepository') getEventTranslationRepository: Getter<EventTranslationRepository>,
    @repository.getter('EventTranslationRepository') protected eventTranslationRepositoryGetter: Getter<EventTranslationRepository>, @repository.getter('EventTranslationProdRepository') protected eventTranslationProdRepositoryGetter: Getter<EventTranslationProdRepository>,
  ) {
    super(Event, dataSource);
    this.translations_prod = this.createHasManyRepositoryFactoryFor('translations_prod', eventTranslationProdRepositoryGetter,);
    this.registerInclusionResolver('translations_prod', this.translations_prod.inclusionResolver);
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
