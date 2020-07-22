import { DefaultCrudRepository } from '@loopback/repository';
import { EventTagTranslation, EventTagTranslationRelations } from '../models';
import { MicadoDsDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class EventTagTranslationRepository extends DefaultCrudRepository<
    EventTagTranslation,
    typeof EventTagTranslation.prototype.id,
    EventTagTranslationRelations
    > {
    constructor(
        @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
    ) {
        super(EventTagTranslation, dataSource);
    }
}
