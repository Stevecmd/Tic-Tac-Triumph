const sqlite3 = require('sqlite3').verbose();
const path = require("path");

class Database {
    constructor(dbName) {
        this.dbName = dbName;
        this.db = null;
    }

    async open() {
        try {
            this.db = new sqlite3.Database(this.dbName, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Connected to the SQLite database.');
            });
            await this.createScoreTable();
        } catch (error) {
            console.error(error.message);
        }
    }

    async close() {
        if (this.db) {
            await new Promise((resolve, reject) => {
                this.db.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }

    async createScoreTable() {
        try {
            await new Promise((resolve, reject) => {
                this.db.run(`CREATE TABLE IF NOT EXISTS scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT,
          score INTEGER
        )`, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error(error.message);
        }
    } async getAllScores() {
        try {
            return new Promise((resolve, reject) => {
                this.db.all('SELECT * FROM scores', (err, rows) => {
                    if (err) { reject(err); } else { resolve(rows); }
                });
            });
        } catch (error) {
            console.error(error.message);
        }
    }
    async saveScore(username, score) {
        try {
            await new Promise((resolve, reject) => {
                this.db.run(`INSERT INTO scores (username, score) VALUES (?, ?)`, [username, score], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error(error.message);
        }
    }
}

const dbFilePath = path.join(__dirname, 'scores.db');
const db = new Database(dbFilePath);
db.open().then(() => {
    console.log('Database opened');
}).catch((err) => {
    console.log('Could not open database: ');
    console.error(err.message);
});

module.exports = db;