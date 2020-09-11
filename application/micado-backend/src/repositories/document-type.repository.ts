import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DocumentType, DocumentTypeRelations, DocumentTypeTranslation, DocumentTypePicture, DocumentTypeTranslationProd} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DocumentTypeTranslationRepository} from './document-type-translation.repository';
import {DocumentTypePictureRepository} from './document-type-picture.repository';
import {DocumentTypeTranslationProdRepository} from './document-type-translation-prod.repository';

export class DocumentTypeRepository extends DefaultCrudRepository<
  DocumentType,
  typeof DocumentType.prototype.id,
  DocumentTypeRelations
> {

  public readonly translations: HasManyRepositoryFactory<DocumentTypeTranslation, typeof DocumentType.prototype.id>;

  public readonly pictures: HasManyRepositoryFactory<DocumentTypePicture, typeof DocumentType.prototype.id>;

  public readonly translations_prod: HasManyRepositoryFactory<DocumentTypeTranslationProd, typeof DocumentType.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('DocumentTypeTranslationRepository') protected documentTypeTranslationRepositoryGetter: Getter<DocumentTypeTranslationRepository>, @repository.getter('DocumentTypePictureRepository') protected documentTypePictureRepositoryGetter: Getter<DocumentTypePictureRepository>, @repository.getter('DocumentTypeTranslationProdRepository') protected documentTypeTranslationProdRepositoryGetter: Getter<DocumentTypeTranslationProdRepository>,
  ) {
    super(DocumentType, dataSource);
    this.translations_prod = this.createHasManyRepositoryFactoryFor('translations_prod', documentTypeTranslationProdRepositoryGetter,);
    this.registerInclusionResolver('translations_prod', this.translations_prod.inclusionResolver);
    this.pictures = this.createHasManyRepositoryFactoryFor('pictures', documentTypePictureRepositoryGetter,);
    this.registerInclusionResolver('pictures', this.pictures.inclusionResolver);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', documentTypeTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
