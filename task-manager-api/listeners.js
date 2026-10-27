const taskEvents = require("./events");

taskEvents.on("task-created", (task) => {
  setTimeout(() => {            // artificial 2 s delay so the async behaviour is visible
    try {
      if (!task.title) throw new Error("Task title is missing");
      console.log(`[Notification] Task "${task.title}" created for user ${task.user} at ${new Date().toISOString()}`);
    } catch (err) { taskEvents.emit("error", err); }
  }, 2000);
});

taskEvents.on("task-deleted", (task) => {
  console.log(`[Notification] Task "${task.title}" was deleted at ${new Date().toISOString()}`);
});

taskEvents.on("error", (err) => { console.error(`[Event Error] ${err.message}`); });
