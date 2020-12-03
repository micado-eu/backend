import {DefaultCrudRepository, Entity} from '@loopback/repository';

export abstract class BaseTranslationRepository<
  E extends Entity,
  IdType,
  Relations extends object
  > extends DefaultCrudRepository<E, IdType, Relations> {

  getIdColumnName(): string {
    return 'id';
  }

  getTranslatableColumnNames(): Array<string> {
    const tableName = this.getTableName();
    return [tableName.replace(/\_translation$/, "")];
  }

  public getTableName(): string {
    return (<any>(this.modelClass)).settings.postgresql.table;
  }

  public async getBaseLanguageTranslatables(language: string): Promise<any> {
    const q = 'SELECT "' + this.getIdColumnName() + '" as "id", "lang", ' + this.getTranslatableColumnNames().map(c => `"${c}"`).join(',') + ', "translationState" FROM ' + this.getTableName() + ' t1 WHERE "lang"=$1 AND (SELECT COUNT(*) from ' + this.getTableName() + ' WHERE "' + this.getIdColumnName() + '"=t1.' + this.getIdColumnName() + ' AND "translationState" in (1,2)) > 0;';
    const results = await this.dataSource.execute(q, [language]);

    for (let i = 0; i < results.length; i++) {
      const strings: any = {};
      this.getTranslatableColumnNames().forEach((columnName) => {
        strings[columnName] = results[i][columnName];
        delete results[i][columnName];
      });
      results[i]['strings'] = strings;
    }

    return results;
  }

  public getTranslatableLanguages(): any {
    const q = 'SELECT DISTINCT "lang" FROM ' + this.getTableName() + ' t1 WHERE (SELECT COUNT(*) from ' + this.getTableName() + ' WHERE "' + this.getIdColumnName() + '"=t1.' + this.getIdColumnName() + ' AND "translationState" in (1,2)) > 0;';
    return this.dataSource.execute(q);
  }

  /**
   * Update strings in the translating state to translated if they are non empty and changed.
   * @param baseLanguage: The base language.
   * @param translations: dictionary of {1: {en: "house", nl: "huis"}}
   */
  public async updateToTranslated(baseLanguage: string, translations: {[id: number]: {[language: string]: {[columnName: string]: string}}}) {
    const columnsAssign = this.getTranslatableColumnNames();
    for (let i = 0; i < columnsAssign.length; i++) {
      columnsAssign[i] = columnsAssign[i] + '=' + '$' + (i + 1).toString();
    }

    const columnsUpdated = this.getTranslatableColumnNames();
    for (let i = 0; i < columnsUpdated.length; i++) {
      columnsUpdated[i] = '(t1.' + columnsUpdated[i] + ' != $' + (i + 1).toString() + ' OR t1.' + columnsUpdated[i] + ' ISNULL)';
    }


    let q = `
    UPDATE ` + this.getTableName() + ` AS t1
    SET ` + columnsAssign.join(', ') + `,
    "translationState" = 3
    WHERE "translationState" = 2
    AND "lang" = $` + (columnsAssign.length + 1).toString() + `
    AND "` + this.getIdColumnName() + `" = $` + (columnsAssign.length + 2).toString() + `
    AND ` + columnsUpdated.join(' AND ') + `;
    `;

    for (const id in translations) {
      for (const language in translations[id]) {
        const args: Array<any> = [];
        this.getTranslatableColumnNames().forEach((columnName) => {
          if (!translations[id][language].hasOwnProperty(columnName)) {
            return;
          }

          let text = translations[id][language][columnName];
          if (text === null) {
            return;
          }

          text = text.trim();
          if (text.length === 0) {
            return;
          }

          args.push(text);
        });

        if (args.length !== this.getTranslatableColumnNames().length) {
          // Some columns are empty or null. So we don't update this.
          continue;
        }

        args.push(language);
        args.push(id);
        await this.dataSource.execute(q, args);
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
    const ids = translatables.filter((t: any) => (t.translationState === 1)).map((t: any) => t.id);

    if (ids.length === 0) {
      return;
    }

    const q = 'UPDATE ' + this.getTableName() + ' SET "translationState" = 2 WHERE "translationState" = 1 AND "' + this.getIdColumnName() + '" in ( ' + ids.map((id, i) => '$' + (i + 1).toString()).join(',') + ' );';
    await this.dataSource.execute(q, ids);
  }
}
