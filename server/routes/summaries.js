const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const auth = require("../middlewares/auth");

const prisma = new PrismaClient();

// POST /api/summaries - Save a new summary
router.post("/", auth, async (req, res) => {
  const { transcript, result } = req.body;

  const email = req.user.email;
  console.log(email);

  try {
    //  Find user by email to get their ID
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "User not found" });
      console.log(email);
  console.log(result);
    const saved = await prisma.summary.create({
      data: {
        email,
        transcript,
        result,
        userId: user.id, //  store FK
      },
    });

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save summary" });
  }
});

// GET /api/summaries - Fetch all user summaries
router.get("/", auth, async (req, res) => {
  const email = req.user.email;

  try {
    // 🔍 Find user by email to get ID
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "User not found" });

    const summaries = await prisma.summary.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(summaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summaries" });
  }
});


router.delete('/:id', auth , async (req, res) => {
  const { id } = req.params;
  const userEmail = req.user?.email;// Get user email from auth middleware
  console.log("Deleting summary with ID:", id, "for user:", userEmail);

  if (!userEmail) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    await prisma.summary.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
