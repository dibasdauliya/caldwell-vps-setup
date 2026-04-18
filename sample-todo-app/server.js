const express = require("express");
const Datastore = require("@seald-io/nedb");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const db = new Datastore({ filename: path.join(__dirname, "data", "todos.db"), autoload: true });

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Get all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await db.findAsync({}).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a todo
app.post("/api/todos", async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }
  try {
    const todo = await db.insertAsync({ text: text.trim(), done: false, createdAt: new Date() });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle todo done
app.patch("/api/todos/:id", async (req, res) => {
  try {
    const todo = await db.findOneAsync({ _id: req.params.id });
    if (!todo) return res.status(404).json({ error: "Not found" });
    await db.updateAsync({ _id: req.params.id }, { $set: { done: !todo.done } });
    res.json({ ...todo, done: !todo.done });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const removed = await db.removeAsync({ _id: req.params.id }, {});
    if (removed === 0) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
