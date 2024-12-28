import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { BsCheckCircle, BsCircle, BsTrash } from 'react-icons/bs'; // Import icons

function Home() {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/todos');
            setTodos(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addTodo = async () => {
        if (!task.trim()) return; // Prevent empty tasks
        try {
            const response = await axios.post('http://localhost:5000/todos', { task });
            setTodos([...todos, response.data]);
            setTask('');
        } catch (err) {
            console.error(err);
        }
    };

    const toggleComplete = async (id, completed) => {
        try {
            const response = await axios.put(`http://localhost:5000/todos/${id}`, { completed: !completed });
            setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/todos/${id}`);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h1>To-Do List</h1>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter a new task"
            />
            <button onClick={addTodo}>Add Task</button>

            <ul>
                {todos.map(todo => (
                    <li key={todo._id} className={todo.completed ? 'completed' : ''}>
                        <span>{todo.task}</span>
                        <div>
                            {/* Complete Icon */}
                            <span onClick={() => toggleComplete(todo._id, todo.completed)} style={{ cursor: 'pointer', marginRight: '10px' }}>
                                {todo.completed ? <BsCheckCircle size={20} color="green" /> : <BsCircle size={20} />}
                            </span>

                            {/* Delete Icon */}
                            <span onClick={() => deleteTodo(todo._id)} style={{ cursor: 'pointer' }}>
                                <BsTrash size={20} color="red" />
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;
