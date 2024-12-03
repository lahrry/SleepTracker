// src/database.ts
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open a database connection to `database.sqlite`
const initDatabase = async () => {
    const db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database,
    });

    // Create tasks table if it doesn't exist
    await db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            time_work_on INTERVAL DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP, 
            assigned_date DATE DEFAULT (CURRENT_DATE)
        );
    `);

     // Create sleep table if it doesn't exist
     await db.exec(`
        CREATE TABLE IF NOT EXISTS sleep (
            date TEXT PRIMARY KEY,
            sleep_time INTEGER NOT NULL
        );
    `);

    return db;
};

export default initDatabase;
