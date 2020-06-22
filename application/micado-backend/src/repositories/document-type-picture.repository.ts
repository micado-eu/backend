import {DefaultCrudRepository} from '@loopback/repository';
import {DocumentTypePicture, DocumentTypePictureRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DocumentTypePictureRepository extends DefaultCrudRepository<
  DocumentTypePicture,
  typeof DocumentTypePicture.prototype.id,
  DocumentTypePictureRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(DocumentTypePicture, dataSource);
  }
}
