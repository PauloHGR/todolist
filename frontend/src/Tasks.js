import React, { useState, useEffect } from 'react';
import API from './api';

function Tasks({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  const fetchTasks = async () => {
    const res = await API.get('tasks/');
    setTasks(res.data);
  };

  const createTask = async () => {
    if (!newTitle.trim()) return;
    await API.post('tasks/', { title: newTitle, completed: false });
    setNewTitle('');
    fetchTasks();
  };

  const toggleCompleted = async (task) => {
    await API.put(`tasks/${task.id}/`, {
      ...task,
      completed: !task.completed,
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`tasks/${id}/`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    /*<div>
      <h2>Minhas Tarefas</h2>
      <input
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        placeholder="Nova tarefa"
      />
      <button onClick={createTask}>Adicionar</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              onClick={() => toggleCompleted(task)}
              style={{ textDecoration: task.completed ? 'line-through' : 'none', cursor: 'pointer' }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>Excluir</button>
          </li>
        ))}
      </ul>
      <button onClick={onLogout}>Sair</button>
    </div>*/
    <div style={{ padding: '20px', maxWidth: 600, margin: '0 auto' }}>
      <h1>📝 Lista de Tarefas</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Nova tarefa"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ padding: '8px', width: '70%' }}
        />
        <button onClick={createTask} style={{ padding: '8px 12px', marginLeft: 10 }}>
          Adicionar
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: 10 }}>
            <span
              onClick={() => toggleCompleted(task)}
              style={{
                cursor: 'pointer',
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              style={{ marginLeft: 10, color: 'red' }}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onLogout}>Sair</button>
    </div>
  );
}

export default Tasks;