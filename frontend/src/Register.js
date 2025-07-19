import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = async () => {
    try {
      await axios.post('http://localhost:8000/api/register/', {
        username,
        password,
      });
      alert('Usuário criado com sucesso!');
      onRegister();
    } catch (err) {
      alert('Erro ao registrar');
    }
  };

  return (
    <div>
      <h2>Registrar</h2>
      <input placeholder="Usuário" onChange={e => setUsername(e.target.value)} />
      <input placeholder="Senha" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={registerUser}>Criar Conta</button>
    </div>
  );
}

export default Register;