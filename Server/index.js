// Load environment variables from a .env file
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const todoSchema = require('./validation');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// MongoDB connection using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Failed to connect to MongoDB:", err));

// Define the To-Do model
const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', todoSchema);

// CRUD Routes

// Create (POST) - Add a new to-do item
app.post('/todos', async (req, res) => {
    const { error } = todoSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const newTodo = new Todo({
            task: req.body.task,
            completed: req.body.completed || false
        });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Read (GET) - Retrieve all to-do items
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update (PUT) - Update a to-do item by ID
app.put('/todos/:id', async (req, res) => {
    const { error } = todoSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            { completed: req.body.completed },
            { new: true } // Return the updated document
        );
        res.json(updatedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Delete (DELETE) - Delete a to-do item by ID
app.delete('/todos/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
