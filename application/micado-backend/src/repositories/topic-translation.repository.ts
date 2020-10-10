import {DefaultCrudRepository} from '@loopback/repository';
import {TopicTranslation, TopicTranslationRelations} from '../models';
import {MicadoDsDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TopicTranslationRepository extends DefaultCrudRepository<
  TopicTranslation,
  typeof TopicTranslation.prototype.id,
  TopicTranslationRelations
> {
  constructor(
    @inject('datasources.micadoDS') dataSource: MicadoDsDataSource,
  ) {
    super(TopicTranslation, dataSource);
  }

  /**
   * Get all objects that should be pushed to weblate.
   * This includes strings in state 'translatable' but also it's siblings that are in any other state (otherwise weblate thinks it has to be translated again).
   *
   */
  public getTranslatables(): any {
    const q = 'SELECT "id", "lang", "topic" AS "text", "translationState" FROM topic_translation t1 WHERE (SELECT COUNT(*) from topic_translation WHERE "id"=t1.id AND "translationState" in (1,2)) > 0;';
    return this.dataSource.execute(q);
  }

  /**
   * Update strings in the translating state to translated if they are non empty.
   * @param translations: dictionary of {1: {en: "house", nl: "huis"}} 
   */
  public async updateToTranslated(translations: {[id: number]: {[language: string]: string}}) {
    let q = 'UPDATE topic_translation SET "topic" = $1, "translationState" = 3 WHERE "translationState" = 2 AND "lang" = $2 AND "id" = $3;';
    for(const id in translations) {
      for(const language in translations[id]) {
        let text = translations[id][language];
        if(text === null) {
          continue;
        }

        text = text.trim();
        if(text.length === 0) {
          continue;
        }

        await this.dataSource.execute(q, [text, language, id]);
      }
    }
  }

  /**
   * Update strings in the translatable state to translating.
   * @param translatables: Array of [{translationState: 1, id: 1}, ...]
   */
  public async updateToTranlating(translatables: [{translationState: number, id: number}]) {
    let ids = translatables.filter((t: any) => (t.translationState === 1)).map((t: any) => t.id);

    if(ids.length === 0) {
      return;
    }

    const q = 'UPDATE topic_translation SET "translationState" = 2 WHERE "translationState" = 1 AND "id" in ( ' + ids.join(',') + ' );';
    await this.dataSource.execute(q);
  }
}
