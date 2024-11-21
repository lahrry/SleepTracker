import express from 'express';
import cors from 'cors';
import taskRoutes from './tasks_backend/task-endpoints';
import sleepRoutes from './sleep_backend/sleep-endpoints'; 

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/v1/tasks', taskRoutes); 
app.use('/api/v1/sleep', sleepRoutes); 

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
