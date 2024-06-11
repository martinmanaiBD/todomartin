import React, { useState, useEffect } from 'react';
import './App.css';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const newTaskObj: Task = { id: Date.now(), text: newTask, completed: false };
      setTasks([...tasks, newTaskObj]);
      setNewTask('');
    }
  };

  const handleToggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSaveToFile = () => {
    const json = JSON.stringify(tasks, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasklist.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (text) {
          const importedTasks = JSON.parse(text as string);
          setTasks(importedTasks);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo List</h1>
        <div className="input-container">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="task-input"
          />
          <button onClick={handleAddTask} className="add-button">Add Task</button>
        </div>
        <div className="file-actions">
          <button onClick={handleSaveToFile} className="save-button">Save Tasks</button>
          <input type="file" accept=".json" onChange={handleFileUpload} className="upload-input" />
        </div>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <span
                className={`circle ${task.completed ? 'completed' : ''}`}
                onClick={() => handleToggleTaskCompletion(task.id)}
              ></span>
              <span className="task-text">{task.text}</span>
              <button onClick={() => handleDeleteTask(task.id)} className="delete-button">Delete</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
