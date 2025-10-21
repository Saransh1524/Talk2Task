const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const dummyPasswordHash = bcrypt.hashSync("test1234", 10);

const prisma = new PrismaClient();

// im-memory user db 
// const users = [
//   {
//     email: "test@example.com",
//     password: dummyPasswordHash
//   }
// ];
// router.post('/register', async (req, res) => {
//   const { email, password } = req.body;
//   const hashed = await bcrypt.hash(password, 10);
//   users.push({ email, password: hashed });
//   res.json({ message: 'User registered' });
// });


router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received body:", req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  res.json({ message: "User registered" });
});

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const user = users.find(u => u.email === email);
//   if (!user) return res.status(400).json({ error: 'Invalid credentials' });

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) return res.status(400).json({ error: 'Invalid credentials' });

//   const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
//   res.json({ token });
// });

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "No account found with this email." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Incorrect password. Please try again." });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Something went wrong while logging in. Please try again later." });
  }
});
module.exports = router;
