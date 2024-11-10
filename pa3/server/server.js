import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'leesin',
  database: 'facres',
  socketPath: '/tmp/mysql.sock'
});

app.get('/api/facilities', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM facilities');
    res.json(results);
  } catch (err) {
    console.error('Error fetching facilities:', err);
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});