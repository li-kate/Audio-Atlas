require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("Error: MONGO_URI is not defined in .env file");
  process.exit(1); // Stop the server if no MongoDB URI is found
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const User = require('./models/User');

app.post('/api/users', async (req, res) => {
  const { auth0Id, email, name } = req.body;
  try {
    const user = new User({ auth0Id, email, name });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});