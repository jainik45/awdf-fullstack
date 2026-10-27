require("dotenv").config();
const taskEvents = require("./events");
require("./listeners");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const auth = require("./middleware/auth");
const cache = require("./cache");
const {
  validateAuthInput,
  validateTask,
  validateTaskUpdate,
} = require("./middleware/validate");
const { register, login, me } = require("./controllers/authController");

// Validate required environment variables
const { MONGO_URI, JWT_SECRET, PORT = 5000 } = process.env;

if (!MONGO_URI || !JWT_SECRET) {
  console.error("CRITICAL ERROR: MONGO_URI and JWT_SECRET must be defined in .env");
  process.exit(1);
}

const app = express();

// 1. CORS Middleware
app.use(cors());

// 2. Request Logger Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// 3. Content-Type Enforcer Middleware (POST and PUT must be application/json)
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.toLowerCase().includes("application/json")) {
      return res.status(415).json({ error: "Content-Type must be application/json" });
    }
  }
  next();
});

// 4. JSON Body Parser
app.use(express.json());

// Helper: validateId middleware using mongoose.isValidObjectId
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }
  next();
};

// Helper: find task owned by the authenticated user
const findOwned = async (id, userId) => {
  return await Task.findOne({ _id: id, user: userId });
};

// Route: Test Error handler demonstration
app.get("/test-error", (req, res, next) => {
  next(new Error("Demonstrating error handler"));
});

// Route: Cache diagnostic telemetry endpoint (Practical 9)
app.get("/debug/cache", auth, (req, res) => {
  res.status(200).json({
    ...cache.counters,
    cachedKeys: cache.keys().length,
  });
});

// Auth Routes (Practical 7)
app.post("/register", validateAuthInput, register);
app.post("/login", validateAuthInput, login);
app.get("/me", auth, me);

// Task Routes with node-cache and EventEmitter (Practicals 9 & 10)
app.get("/tasks", auth, async (req, res, next) => {
  try {
    const listKey = `all_tasks_${req.user.id}`;
    const cachedTasks = cache.get(listKey);

    if (cachedTasks) {
      cache.counters.hits++;
      console.log(`[cache] HIT  ${listKey}`);
      res.setHeader("X-Cache", "HIT");
      return res.status(200).json(cachedTasks);
    }

    cache.counters.misses++;
    console.log(`[cache] MISS ${listKey} -> querying MongoDB`);
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    cache.set(listKey, tasks);
    res.setHeader("X-Cache", "MISS");
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

app.get("/tasks/:id", auth, validateId, async (req, res, next) => {
  try {
    const taskKey = `task_${req.user.id}_${req.params.id}`;
    const cachedTask = cache.get(taskKey);

    if (cachedTask) {
      cache.counters.hits++;
      console.log(`[cache] HIT  ${taskKey}`);
      res.setHeader("X-Cache", "HIT");
      return res.status(200).json(cachedTask);
    }

    cache.counters.misses++;
    console.log(`[cache] MISS ${taskKey} -> querying MongoDB`);
    const task = await findOwned(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    cache.set(taskKey, task);
    res.setHeader("X-Cache", "MISS");
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

app.post("/tasks", auth, validateTask, async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;
    const task = await Task.create({
      title,
      description: description || "",
      priority: priority || "medium",
      user: req.user.id,
    });

    // Invalidate user's task list cache after write
    const listKey = `all_tasks_${req.user.id}`;
    cache.del(listKey);

    // Practical 10: Emit event AFTER sending API response
    console.log(`[API] Response sent at ${new Date().toISOString()}`);
    res.status(201).json(task);
    taskEvents.emit("task-created", task);
  } catch (err) {
    next(err);
  }
});

app.put("/tasks/:id", auth, validateId, validateTaskUpdate, async (req, res, next) => {
  try {
    const existingTask = await findOwned(req.params.id, req.user.id);
    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const updateData = { ...req.body };
    delete updateData.user; // user can never be changed through PUT

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    // Invalidate user list and task item cache after write
    const listKey = `all_tasks_${req.user.id}`;
    const taskKey = `task_${req.user.id}_${req.params.id}`;
    cache.del([listKey, taskKey]);

    res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
});

app.delete("/tasks/:id", auth, validateId, async (req, res, next) => {
  try {
    const existingTask = await findOwned(req.params.id, req.user.id);
    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    // Invalidate user list and task item cache after write
    const listKey = `all_tasks_${req.user.id}`;
    const taskKey = `task_${req.user.id}_${req.params.id}`;
    cache.del([listKey, taskKey]);

    // Practical 10: Emit task-deleted after sending response
    res.status(200).json({ message: "Task deleted", task });
    taskEvents.emit("task-deleted", task);
  } catch (err) {
    next(err);
  }
});

// 5. JSON 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// 6. Centralized Global Error Handler LAST
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const details = Object.keys(err.errors).map((field) => ({
      field,
      message: err.errors[field].message,
    }));
    return res.status(400).json({ error: "Validation failed", details });
  }

  // Mongoose CastError
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({ error: "Something went wrong" });
});

// Database connection and server initialization
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err.message);
      process.exit(1);
    });
}

module.exports = app;
