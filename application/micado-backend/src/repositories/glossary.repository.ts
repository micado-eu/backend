import {DefaultCrudRepository} from '@loopback/repository';
import {Glossary, GlossaryRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class GlossaryRepository extends DefaultCrudRepository<
  Glossary,
  typeof Glossary.prototype.id,
  GlossaryRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(Glossary, dataSource);
  }
}
