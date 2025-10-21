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

Your task is to analyze the following meeting transcript and produce a **clean, structured, and minimal text output** in this exact format (no extra asterisks, markdown, or explanations):

Summary:
- point 1
- point 2
- point 3

Action Items:
Person: Task (Deadline: YYYY-MM-DD)
Person: Task (Deadline: YYYY-MM-DD)

Key Decisions:
- decision 1
- decision 2

Guidelines:
- Keep sentences concise and professional.
- Never use markdown formatting (*, **, or bullets other than "-").
- Ensure consistent indentation and no blank lines between sections.
- Convert all relative deadlines (like "next week" or "by Friday") into explicit YYYY-MM-DD format based on the meeting date if mentioned in the transcript.
- If no action items or decisions exist, still include the section name but leave it empty.

Transcript:
${transcript}
`;


  try {

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ result: text });
    console.log(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gemini API failed' });
  }
});

module.exports = router;
