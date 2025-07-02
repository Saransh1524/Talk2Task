const { GoogleGenerativeAI } = require("@google/generative-ai");
const authMiddleware = require('../middlewares/auth');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// rate limiter middleware
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window 
  max: 10, // Limit each IP to 10 summarize requests per hour
  // making the rate limit using user email if available, otherwise fallback to IP
  keyGenerator: (req, res) => {
    return req.user?.email || req.ip; // fallback to IP
  },
  message: {
    error: "Too many requests. Please try again after an hour.",
  },
  standardHeaders: true,// 
  legacyHeaders: false,// 
});



router.post('/', authMiddleware, limiter, async (req, res) => {
  const { transcript } = req.body;

  //validate the transcript
  if (!transcript || transcript.trim() === '') {
    return res.status(400).json({ error: "Transcript is required" });
  }

const prompt = `
You are a meeting summarization assistant.

Given the following transcript, your tasks are:
1. Summarize the meeting in concise bullet points.
2. Extract action items in the format: Person: Task by Date.
   - ⚠️ IMPORTANT: Convert relative deadlines (e.g., "by Friday", "next week") into actual calendar by taking the data of the meeting from the transcript.
   - Dates must be in YYYY-MM-DD format.
3. List any key decisions made.
4. do not give the heading like this "**Key Decisions:**" or "**Action Items:**". It shoould be just Key Decisions: and Action Items:
Use professional tone, avoid personal interpretations, and keep the output clear and structured.

Transcript:
${transcript}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ result: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gemini API failed' });
  }
});

module.exports = router;
