var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Database } from 'sql.js';
var SQLiteObjectBrowser = (function (_super) {
    __extends(SQLiteObjectBrowser, _super);
    function SQLiteObjectBrowser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SQLiteObjectBrowser.prototype.executeSql = function (statement, params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var st = _this._objectInstance.prepare(statement, params);
                var rows_1 = [];
                while (st.step()) {
                    rows_1.push(st.getAsObject());
                }
                var payload = {
                    rows: {
                        item: function (i) { return rows_1[i]; },
                        length: rows_1.length
                    },
                    rowsAffected: _this._objectInstance.getRowsModified() || 0,
                    insertId: _this._objectInstance.insertId || void 0
                };
                resolve(payload);
            }
            catch (e) {
                reject(e);
            }
        });
    };
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
    SQLiteObjectBrowser.prototype.sqlBatch = function (sqlStatements) {
        return __awaiter(this, void 0, void 0, function () {
            var i, sqlStatement, params, query, queryPos, paramsPos, querys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (sqlStatements == null || sqlStatements.length == 0) {
                            return [2 /*return*/, Promise.reject('No statements')];
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < sqlStatements.length)) return [3 /*break*/, 4];
                        sqlStatement = sqlStatements[i];
                        params = [];
                        query = null;
                        if (typeof sqlStatement == 'string') {
                            query = sqlStatement;
                        }
                        else if (sqlStatement instanceof Array) {
                            queryPos = 0, paramsPos = 1;
                            querys = sqlStatement;
                            if (querys.length > 0 && typeof querys[queryPos] == 'string') {
                                // Looking for the query
                                query = querys[queryPos];
                            }
                            if (query != null && querys.length > 1 && querys[paramsPos] instanceof Array) {
                                // Looking for the params
                                params = querys[paramsPos];
                            }
                        }
                        if (query == null) {
                            return [2 /*return*/, Promise.reject('SqlBatch contains an invalid query')];
                        }
                        return [4 /*yield*/, this.executeSql(query, params)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, Promise.resolve('Success')];
                }
            });
        });
    };
    return SQLiteObjectBrowser;
}(SQLiteObject));
var SQLiteBrowser = (function (_super) {
    __extends(SQLiteBrowser, _super);
    function SQLiteBrowser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SQLiteBrowser.prototype.create = function (config) {
        return new Promise(function (resolve, reject) { resolve(new SQLiteObjectBrowser(SQLiteBrowser.DATABASE)); });
    };
    SQLiteBrowser.prototype.echoTest = function () {
        return new Promise(function (resolve, reject) { resolve(); });
    };
    SQLiteBrowser.prototype.deleteDatabase = function (config) {
        return new Promise(function (resolve, reject) { resolve(); });
    };
    SQLiteBrowser.DATABASE = new Database();
    return SQLiteBrowser;
}(SQLite));
export { SQLiteBrowser };
//# sourceMappingURL=sqlite-browser.js.map