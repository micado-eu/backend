import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MicadoDsDataSource} from '../datasources';
import {Board, BoardRelations} from '../models';

export class BoardRepository extends DefaultCrudRepository<
  Board,
  typeof Board.prototype.id,
  BoardRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(Board, dataSource);
  }
}
