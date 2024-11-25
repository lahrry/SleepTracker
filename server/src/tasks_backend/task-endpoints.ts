import express from 'express';
import initDatabase from '../database';
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

// Connect to the SQLite database
let db: any;

initDatabase().then((database) => {
    db = database;
});

// Endpoint to create a new task with a `createdAt` timestamp in Pacific Time
router.post('/', async (req, res) => {
    const { title } = req.body;
    try {
        // Set the createdAt timestamp in Pacific Time
        const createdAt = getPacificTime();

        const result = await db.run(
            'INSERT INTO tasks (title, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
            [title, false, createdAt,  createdAt]
        );
        const task = await db.get('SELECT * FROM tasks WHERE id = ?', [result.lastID]);
        res.status(201).json(task);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
});

// Endpoint to get tasks that are either not done or completed today
router.get('/', async (req, res) => {
    try {
        // Get today's date in Pacific Time
        const today = getTodayPacificDate();

        // Fetch tasks that are either not completed or completed today
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

// Endpoint to update a task's completion status
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { completed, time_work_on} = req.body;
  
    try {
        // Set the updatedAt timestamp in Pacific Time when updating completion status
        const updatedAt = getPacificTime();
        await db.run('UPDATE tasks SET completed = ?, updatedAt = ?, time_work_on = ? WHERE id = ?', [completed, updatedAt, time_work_on, id]);
        const updatedTask = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
        res.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
});

// Endpoint to delete a task
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
        await db.run('DELETE FROM tasks WHERE id = ?', [id]);
        res.status(204).send(); // 204 No Content indicates successful deletion with no response body
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task" });
    }
});
  
// Endpoint to get count of completed tasks for each of the last 7 days, based on `updatedAt`
router.get('/completed-last-week', async (req, res) => {
    try {
        const results = [];
        
        // Loop through the last 7 days, including today
        for (let i = 0; i < 7; i++) {
            const day = format(subDays(new Date(), i), 'yyyy-MM-dd'); // Start with today and go backwards
            const result = await db.get(
                `SELECT COUNT(*) as count FROM tasks WHERE completed = 1 AND DATE(updatedAt) = ?`,
                [day]
            );
            results.unshift({ day, count: result.count }); // Unshift to keep the order from past to present
        }

        res.json(results);
    } catch (error) {
        console.error("Error fetching tasks for the last week:", error);
        res.status(500).json({ error: "Failed to fetch completed tasks" });
    }
});

// Endpoint to get the complete history of all tasks
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
