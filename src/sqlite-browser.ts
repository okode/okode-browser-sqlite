import { SQLite, SQLiteDatabaseConfig, SQLiteObject } from '@ionic-native/sqlite';
import { Database } from 'sql.js';

class SQLiteObjectBrowser extends SQLiteObject {

  executeSql(statement: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let st = this._objectInstance.prepare(statement, params);
        let rows: any[] = [];
        while (st.step()) {
          rows.push(st.getAsObject());
        }
        let payload = {
          rows: {
            item: (i: any) => rows[i],
            length: rows.length
          },
          rowsAffected: this._objectInstance.getRowsModified() || 0,
          insertId: this._objectInstance.insertId || void 0
        };
        resolve(payload);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Do multiple sql operations.
   * 
   * @param sqlStatements statements which will be processed and executed
   * Example:
   * [
   *   "INSERT...",
   *   ["UPDATE ... (?, ?)", [1, 2]], // The query is on the first element and the params in he next
   * ]
   */
  async sqlBatch(sqlStatements: Array<string | string[] | any>): Promise<any> {
    if (sqlStatements == null || sqlStatements.length == 0) {
      return Promise.reject('No statements');
    }
    for (let i = 0; i < sqlStatements.length; i++) {
      let sqlStatement = sqlStatements[i];
      let params: any[] = [];
      let query = null;
      if (typeof sqlStatement == 'string') {
        query = sqlStatement as string;
      } else if (sqlStatement instanceof Array) {
        /**
         * Trying to process an SQLStatement like ["UPDATE ... (?, ?)", [1, 2]]
         */
        let queryPos = 0, paramsPos = 1;
        let querys = sqlStatement as Array<any>;
        if (querys.length > 0 && typeof querys[queryPos] == 'string') {
          // Looking for the query
          query = querys[queryPos] as string;
        }
        if (query != null && querys.length > 1 && querys[paramsPos] instanceof Array) {
          // Looking for the params
          params = querys[paramsPos] as Array<any>;
        }
      }
      if (query == null) {
        return Promise.reject('SqlBatch contains an invalid query');
      }
      await this.executeSql(query, params);
    }
    return Promise.resolve('Success');
  }
}

export class SQLiteBrowser extends SQLite {

  static readonly DATABASE = new Database();

  create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {
    return new Promise((resolve, reject) => { resolve(new SQLiteObjectBrowser(SQLiteBrowser.DATABASE)); });
  }

  echoTest(): Promise<any> {
    return new Promise((resolve, reject) => { resolve(); });
  }

  deleteDatabase(config: SQLiteDatabaseConfig): Promise<any> {
    return new Promise((resolve, reject) => { resolve(); });
  }

}