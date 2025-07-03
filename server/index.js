const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use(cors({
  origin: [
    // 'http://localhost:5173',  // Vite dev server
    'https://talk2-taskfrontend.vercel.app', // Production URL
  ],
  credentials: true, // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/summarize', require('./routes/summarize'));
app.use("/api/summaries", require("./routes/summaries"));



// ✅ Only start server when not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

module.exports = app; // Export app for testing
