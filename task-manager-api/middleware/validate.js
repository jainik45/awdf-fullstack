// Validation middleware for Auth and Tasks

const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body || {};
  const details = [];
  const emailRegex = /^\S+@\S+\.\S+$/;

  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    details.push({ field: "email", message: "A valid email is required" });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    details.push({ field: "password", message: "Password must be at least 6 characters" });
  }

  if (details.length > 0) {
    return res.status(400).json({ error: "Validation failed", details });
  }

  next();
};

const validateTask = (req, res, next) => {
  const { title } = req.body || {};
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "Validation failed",
      details: [{ field: "title", message: "Title is required" }],
    });
  }
  req.body.title = title.trim();
  next();
};

const validateTaskUpdate = (req, res, next) => {
  if (req.body && req.body.title !== undefined) {
    const { title } = req.body;
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        error: "Validation failed",
        details: [{ field: "title", message: "Title is required" }],
      });
    }
    req.body.title = title.trim();
  }
  next();
};

module.exports = {
  validateAuthInput,
  validateTask,
  validateTaskUpdate,
};
