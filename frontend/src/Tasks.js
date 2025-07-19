import React, { useState, useEffect } from 'react';
import API from './api';

function Tasks({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [search, setSearch] = useState('');
  const [showCompleted, setShowCompleted] = useState('');
  const [filters, setFilters] = useState({ search: '', completed: '' });
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);


  const fetchTasks = async () => {
    let url = `tasks/?page=${page}`;
    if (filters.search) url += `&search=${filters.search}`;
    if (filters.completed) url += `&completed=${filters.completed}`;

    const res = await API.get(url);
    setTasks(res.data.results);
    setCount(res.data.count);

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
  }, [page, filters]);

  const handleFilter = () => {
    setFilters({
      search: search.trim(),
      completed: showCompleted,
    });
    setPage(1);
  };

  const totalPages = Math.ceil(count / 2);
  return (
    <div style={{ padding: 20 }}>
      <h2>📋 Lista de Tarefas</h2>

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

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />

        <select
          value={showCompleted}
          onChange={(e) => { setShowCompleted(e.target.value); setPage(1); }}
          style={{ marginLeft: 10 }}
        >
          <option value="">Todas</option>
          <option value="true">Concluídas</option>
          <option value="false">Não Concluídas</option>
        </select>
        <button onClick={handleFilter} style={{ marginLeft: 10 }}>🔍 Filtrar</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: 8 }}>
            <span
              onClick={() => toggleCompleted(task)}
              style={{
                cursor: 'pointer',
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: 10 }}>Excluir</button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 10 }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>⬅️</button>
        <span style={{ margin: '0 10px' }}>
          Página {page} de {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>➡️</button>
      </div>
    <button onClick={onLogout}>Sair</button>
    </div>
  );
}

export default Tasks;