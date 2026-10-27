require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Task = require("../models/Task");

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/seedTasks.js <user-email>");
  process.exit(1);
}

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.error(`User with email "${email}" not found. Please register this user first.`);
      process.exit(1);
    }

    console.log(`Generating 300 tasks for user ${user.email} (ID: ${user._id})...`);

    const priorities = ["low", "medium", "high"];
    const sampleTitles = [
      "Implement REST endpoint",
      "Optimize MongoDB query indexes",
      "Write unit and integration tests",
      "Configure Docker compose multi-stage build",
      "Refactor authentication middleware pipeline",
      "Implement lazy loading and code splitting",
      "Verify node-cache TTL eviction policies",
      "Set up asynchronous notification listeners",
      "Review pull request code changes",
      "Update technical documentation and README",
    ];

    const tasks = [];
    for (let i = 1; i <= 300; i++) {
      const titlePrefix = sampleTitles[(i - 1) % sampleTitles.length];
      const priority = priorities[(i - 1) % priorities.length];
      const completed = i % 3 === 0;

      tasks.push({
        title: `${titlePrefix} #${i}`,
        description: `Detailed description for seeded benchmark task #${i} with priority ${priority}.`,
        completed,
        priority,
        user: user._id,
        createdAt: new Date(Date.now() - i * 60000), // staggered timestamps
      });
    }

    await Task.insertMany(tasks);
    console.log(`Successfully seeded ${tasks.length} tasks for ${email}!`);
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
