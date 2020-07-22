import { DefaultCrudRepository, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { EventTag, EventTagRelations, EventTagTranslation } from '../models';
import { MicadoDsDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { EventTagTranslationRepository } from '.';

export class EventTagRepository extends DefaultCrudRepository<
    EventTag,
    typeof EventTag.prototype.id,
    EventTagRelations
    > {
    public readonly orders: HasManyRepositoryFactory<
        EventTagTranslation,
        typeof EventTag.prototype.id
    >;

    public readonly translations: HasManyRepositoryFactory<EventTagTranslation, typeof EventTag.prototype.id>;
    constructor(
        @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
        @repository.getter('EventTagTranslationRepository') getEventTagTranslationRepository: Getter<EventTagTranslationRepository>,
        @repository.getter('EventTagTranslationRepository') protected eventTagTranslationRepositoryGetter: Getter<EventTagTranslationRepository>,
    ) {
        super(EventTag, dataSource);
        this.translations = this.createHasManyRepositoryFactoryFor('translations', eventTagTranslationRepositoryGetter);
        this.registerInclusionResolver('translations', this.translations.inclusionResolver);
    }
}
