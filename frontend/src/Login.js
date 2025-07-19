import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      onLogin(); // chama o App para atualizar estado
    } catch (err) {
      alert('Credenciais inválidas');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Usuário" onChange={e => setUsername(e.target.value)} />
      <input placeholder="Senha" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={loginUser}>Entrar</button>
    </div>
  );
}

export default Login;