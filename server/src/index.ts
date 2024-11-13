import express from 'express';
import cors from 'cors'; // Import cors

const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());

// Import and use your routes
import taskRoutes from './task-endpoints';
app.use('/api/v1', taskRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
