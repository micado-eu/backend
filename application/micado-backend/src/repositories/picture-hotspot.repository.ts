import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {PictureHotspot, PictureHotspotRelations, PictureHotspotTranslation} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {PictureHotspotTranslationRepository} from './picture-hotspot-translation.repository';

export class PictureHotspotRepository extends DefaultCrudRepository<
  PictureHotspot,
  typeof PictureHotspot.prototype.id,
  PictureHotspotRelations
> {

  public readonly translations: HasManyRepositoryFactory<PictureHotspotTranslation, typeof PictureHotspot.prototype.id>;

  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource, @repository.getter('PictureHotspotTranslationRepository') protected pictureHotspotTranslationRepositoryGetter: Getter<PictureHotspotTranslationRepository>,
  ) {
    super(PictureHotspot, dataSource);
    this.translations = this.createHasManyRepositoryFactoryFor('translations', pictureHotspotTranslationRepositoryGetter,);
    this.registerInclusionResolver('translations', this.translations.inclusionResolver);
  }
}
