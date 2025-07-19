import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Tasks from './Tasks';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return showRegister ? (
      <Register onRegister={() => setShowRegister(false)} />
    ) : (
      <div>
        <Login onLogin={() => setIsAuthenticated(true)} />
        <p>
          Não tem conta?{' '}
          <button onClick={() => setShowRegister(true)}>Registrar</button>
        </p>
      </div>
    );
  }

  return <Tasks onLogout={handleLogout} />;
}

export default App;