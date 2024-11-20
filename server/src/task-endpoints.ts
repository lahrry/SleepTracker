import express from 'express';
import initDatabase from './database';
import { subDays, format } from 'date-fns';
import { toZonedTime, format as formatTz } from 'date-fns-tz';

const router = express.Router();
const pacificZone = 'America/Los_Angeles';

// Helper function to get current time in Pacific Time
const getPacificTime = () => formatTz(toZonedTime(new Date(), pacificZone), 'yyyy-MM-dd HH:mm:ss', { timeZone: pacificZone });

// Helper function to get today's date in Pacific Time
const getTodayPacificDate = () => format(toZonedTime(new Date(), pacificZone), 'yyyy-MM-dd');

// Connect to the SQLite database
let db: any;
initDatabase().then(database => { db = database; });

// Create a new task
router.post('/tasks', async (req, res) => {
    const { title, time_work_on = 0 } = req.body; // Default time_work_on to 0 seconds
    try {
        const createdAt = getPacificTime();
        const result = await db.run(
            'INSERT INTO tasks (title, completed, time_work_on, createdAt) VALUES (?, ?, ?, ?)',
            [title, false, time_work_on, createdAt]
        );
        const task = await db.get('SELECT * FROM tasks WHERE id = ?', [result.lastID]);
        res.status(201).json(task);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
});

// Fetch all tasks (incomplete or completed today)
router.get('/tasks', async (req, res) => {
    try {
        const today = getTodayPacificDate();
        const tasks = await db.all(`
            SELECT * FROM tasks
            WHERE completed = 0 OR (completed = 1 AND DATE(updatedAt) = ?)
        `, [today]);
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// Update a task's completion status and time worked
router.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { completed, time_work_on } = req.body;
    try {
        const updatedAt = getPacificTime();
        await db.run(
            'UPDATE tasks SET completed = ?, time_work_on = ?, updatedAt = ? WHERE id = ?',
            [completed, time_work_on, updatedAt, id]
        );
        const updatedTask = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
        res.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.run('DELETE FROM tasks WHERE id = ?', [id]);
        res.status(204).send(); // No Content
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task" });
    }
});

// Get count of completed tasks for the last 7 days
router.get('/tasks/completed-last-week', async (req, res) => {
    try {
        const results = [];
        for (let i = 0; i < 7; i++) {
            const day = format(subDays(new Date(), i), 'yyyy-MM-dd');
            const result = await db.get(
                `SELECT COUNT(*) as count FROM tasks WHERE completed = 1 AND DATE(updatedAt) = ?`,
                [day]
            );
            results.unshift({ day, count: result.count });
        }
        res.json(results);
    } catch (error) {
        console.error("Error fetching tasks for the last week:", error);
        res.status(500).json({ error: "Failed to fetch completed tasks" });
    }
});

// Get complete history of tasks
router.get('/tasks/history', async (req, res) => {
    try {
        const tasks = await db.all('SELECT * FROM tasks');
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching task history:", error);
        res.status(500).json({ error: "Failed to fetch task history" });
    }
});

export default router;
