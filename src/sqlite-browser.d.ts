import { SQLite, SQLiteDatabaseConfig, SQLiteObject } from '@ionic-native/sqlite';
import { Database } from 'sql.js';
export declare class SQLiteBrowser extends SQLite {
    static readonly DATABASE: Database;
    create(config: SQLiteDatabaseConfig): Promise<SQLiteObject>;
    echoTest(): Promise<any>;
    deleteDatabase(config: SQLiteDatabaseConfig): Promise<any>;
}
