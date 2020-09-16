import { DefaultCrudRepository } from '@loopback/repository';
import { InformationTagTranslation, InformationTagTranslationRelations } from '../models';
import { MicadoDsDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class InformationTagTranslationRepository extends DefaultCrudRepository<
    InformationTagTranslation,
    typeof InformationTagTranslation.prototype.id,
    InformationTagTranslationRelations
    > {
    constructor(
        @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
    ) {
        super(InformationTagTranslation, dataSource);
    }
}