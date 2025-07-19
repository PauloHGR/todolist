import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');

  const API_URL = 'http://localhost:8000/api/tasks/';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try{
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch(error){
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const addTask = async () => {
    console.log(' tarefa:', newTitle);
    if (!newTitle.trim()) return;
    try {
      await axios.post(API_URL, { title: newTitle, completed: false });
      setNewTitle('');
      fetchTasks();
    } catch(error){
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchTasks();
    } catch(error){
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const toggleTask = async (task) => {
    try {
      await axios.put(`${API_URL}${task.id}/`, {
        ...task,
        completed: !task.completed,
      });
      fetchTasks();
    } catch(error){
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  return (
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
        <button onClick={addTask} style={{ padding: '8px 12px', marginLeft: 10 }}>
          Adicionar
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: 10 }}>
            <span
              onClick={() => toggleTask(task)}
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
    </div>
  );
}

export default App;
