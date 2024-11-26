import express from 'express';
import initDatabase from '../database';
import { SleepRecord } from './sleep-types';
import { subDays, format } from 'date-fns';
import { toZonedTime, format as formatTz } from 'date-fns-tz';

const router = express.Router();
const pacificZone = 'America/Los_Angeles';

// Helper function to get current time in Pacific Time
const getPacificTime = () => {
    return formatTz(toZonedTime(new Date(), pacificZone), 'yyyy-MM-dd HH:mm:ss', { timeZone: pacificZone });
};

// Helper function to get today's date in Pacific Time
const getTodayPacificDate = () => {
    return format(toZonedTime(new Date(), pacificZone), 'yyyy-MM-dd');
};

const getDatabase = async () => {
    if (!db) {
        db = await initDatabase();
    }
    return db;
};

// Connect to the SQLite database
let db: any;

// initDatabase().then((database) => {
//     db = database;
// });


// Endpoint to log sleep data
router.post('/', async (req, res) => {
    const {sleep_time} = req.body;
    const time = getPacificTime().split(" ")[0]
    const db = await getDatabase();
    try {
        await db.run(
            'INSERT INTO sleep (sleep_time, date) VALUES (?, ?)',
            [sleep_time, time]
        );
        const sleepRecord: SleepRecord = await db.get('SELECT * FROM sleep WHERE date = ?', [time]);
        res.status(201).json(sleepRecord);
    } catch (error) {
        console.error("Error logging sleep data:", error);
        res.status(500).json({ error: "Failed to log sleep data" });
    }
});

// Endpoint to log sleep data
router.put('/', async (req, res) => {
    const { sleep_time} = req.body;
    const today = getTodayPacificDate()
    const db = await getDatabase();

    try {
        const existingRecord = await db.get('SELECT * FROM sleep WHERE date = ?', [today]);

        if (existingRecord) {
            await db.run('UPDATE sleep SET sleep_time = ? WHERE date = ?', [sleep_time, today]);
        } else {
            await db.run('INSERT INTO sleep (sleep_time, date) VALUES (?, ?)', [sleep_time, today]);
        }

        const updatedRecord = await db.get('SELECT * FROM sleep WHERE date = ?', [today]);
        res.status(200).json(updatedRecord);
    } catch (error) {
        console.error("Error updating sleep data:", error);
        res.status(500).json({ error: "Failed to update sleep data" });
    }
});


// Endpoint to fetch all sleep data (History)
router.get('/history', async (req, res) => {
    try {
        const db = await getDatabase();
        const sleepRecords: SleepRecord[] = await db.all('SELECT * FROM sleep');
        res.json(sleepRecords);
    } catch (error) {
        console.error("Error fetching sleep history:", error);
        res.status(500).json({ error: "Failed to fetch sleep history" });
    }
});

// Endpoint to fetch today's sleep data
router.get('/today', async (req, res) => {
    try {
        const today = getTodayPacificDate();
        const db = await getDatabase();
        const sleepRecord = await db.get('SELECT * FROM sleep WHERE date = ?', [today]);

        res.json(sleepRecord || {date: today, sleep_time: 0});
    } catch (error) {
        console.error("Error fetching today's sleep data:", error);
        res.status(500).json({ error: "Failed to fetch today's sleep data" });
    }
});

// Endpoint to fetch sleep data for the past 7 days
router.get('/slept-past-week', async (req, res) => {
    try {
        const db = await getDatabase();
        const results = [];
        for (let i = 0; i < 7; i++) {
            const day = format(subDays(new Date(), i), 'yyyy-MM-dd');
            
            // Fetch sleep data for the specific day
            const sleepRecord = await db.get('SELECT sleep_time FROM sleep WHERE date = ?', [day]);

            // Add to results
            results.unshift({
                day,
                count: sleepRecord ? sleepRecord.sleep_time : 0 // Default to 0 if no record
            });
        }
        res.json(results);
    } catch (error) {
        console.error("Error fetching sleep data for the past week:", error);
        res.status(500).json({ error: "Failed to fetch past week's sleep data" });
    }
});


export default router;