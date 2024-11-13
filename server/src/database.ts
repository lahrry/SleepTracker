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
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);

    return db;
};

export default initDatabase;
