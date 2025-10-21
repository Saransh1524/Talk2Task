const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:5173',                  // dev
  'https://talk2-taskfrontend.vercel.app', // prod
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, mobile apps
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.get("/", (req, res) => {
  res.send("Talk2Task API is running 🚀");
});

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
