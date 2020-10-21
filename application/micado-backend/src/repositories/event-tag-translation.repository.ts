import { DefaultCrudRepository } from '@loopback/repository';
import { EventTagTranslation, EventTagTranslationRelations } from '../models';
import { MicadoDsDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { BaseTranslationRepository } from './base-translation.repository';

export class EventTagTranslationRepository extends BaseTranslationRepository<
    EventTagTranslation,
    typeof EventTagTranslation.prototype.id,
    EventTagTranslationRelations
    > {
    constructor(
        @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
    ) {
        super(EventTagTranslation, dataSource);
    }

    getTranslatableColumnNames(): Array<string> {
        return ['tag'];
    }
}
