import {DefaultCrudRepository, Entity} from '@loopback/repository';

export abstract class BaseTranslationRepository <
    E extends Entity,
    IdType,
    Relations extends object
> extends DefaultCrudRepository<E, IdType, Relations> {

  getIdColumnName(): string {
    return 'id';
  }

  getTranslatableColumnName(): string {
    const tableName = this.getTableName();
    return tableName.replace(/\_translation$/, "");
  }

  public getTableName(): string {
    return (<any>(this.modelClass)).settings.postgresql.table;
  }

  public getBaseLanguageTranslatables(language: string): any {
    const q = 'SELECT "' + this.getIdColumnName() + '" as "id", "lang", "' + this.getTranslatableColumnName() + '" AS "text", "translationState" FROM ' + this.getTableName() + ' t1 WHERE "lang"=$1 AND (SELECT COUNT(*) from ' + this.getTableName() + ' WHERE "' + this.getIdColumnName() + '"=t1.' + this.getIdColumnName() + ' AND "translationState" in (1,2)) > 0;';
    return this.dataSource.execute(q, [language]);
  }

  public getTranslatableLanguages(): any {
    const q = 'SELECT DISTINCT "lang" FROM ' + this.getTableName() + ' t1 WHERE (SELECT COUNT(*) from ' + this.getTableName() + ' WHERE "' + this.getIdColumnName() + '"=t1.' + this.getIdColumnName() + ' AND "translationState" in (1,2)) > 0;';
    return this.dataSource.execute(q);
  }


  /**
   * Get all objects that should be pushed to weblate.
   * This includes strings in state 'translatable' but also it's siblings that are in any other state (otherwise weblate thinks it has to be translated again).
   *
   */
  public getTranslatables(): any {
    const q = 'SELECT "id", "lang", "' + this.getTranslatableColumnName() + '" AS "text", "translationState" FROM ' + this.getTableName() + ' t1 WHERE (SELECT COUNT(*) from ' + this.getTableName() + ' WHERE "id"=t1.id AND "translationState" in (1,2)) > 0;';
    return this.dataSource.execute(q);
  }

  /**
   * Update strings in the translating state to translated if they are non empty and changed.
   * @parambaseLanguage: The base language.
   * @param translations: dictionary of {1: {en: "house", nl: "huis"}} 
   */
  public async updateToTranslated(baseLanguage: string, translations: {[id: number]: {[language: string]: string}}) {
    let q = 'UPDATE ' + this.getTableName() + ' AS t1 SET "' + this.getTranslatableColumnName() + '" = $1, "translationState" = 3 WHERE "translationState" = 2 AND "lang" = $2 AND "' + this.getIdColumnName() + '" = $3 AND (t1."' + this.getTranslatableColumnName() + '" != $1 OR t1."' + this.getTranslatableColumnName() + '" ISNULL);';
    console.log(q);
    console.log(translations);
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

    // Since the base language will never be updated above to the 'translated' state (because it never changes compared to the old value)
    // we update them here if all their siblings are translated.
    q = 'UPDATE ' + this.getTableName() + ' AS t1 SET "translationState" = 3 WHERE "translationState" = 2 AND "lang" = $1 AND (SELECT COUNT(*) from ' + this.getTableName() + ' WHERE "' + this.getIdColumnName() + '"=t1.' + this.getIdColumnName() + ' AND "translationState" != 2) > 1;';
    await this.dataSource.execute(q, [baseLanguage]);
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

    const q = 'UPDATE ' + this.getTableName() + ' SET "translationState" = 2 WHERE "translationState" = 1 AND "' + this.getIdColumnName() + '" in ( ' + ids.join(',') + ' );';
    await this.dataSource.execute(q);
  }
}
