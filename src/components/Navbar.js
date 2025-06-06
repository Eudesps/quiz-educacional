// src/components/Navbar.js
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './Navbar.css';

function Navbar({ onLogout, onNavegar }) {
  const [menuAberto, setMenuAberto] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error("Erro ao sair:", error.message);
    }
  };

  return (
<nav className="navbar">
  <div className="navbar-header">
    <h2>Quiz App</h2>
    <button
      className="menu-toggle"
      onClick={() => setMenuAberto(!menuAberto)}
    >
      ☰
    </button>
  </div>

  <div className={`nav-container ${menuAberto ? 'ativo' : ''}`}>
    <div className="nav-links">
      <button onClick={() => onNavegar('inicio')}>Início</button>
      <button onClick={() => onNavegar('historico')}>Histórico</button>
      <button onClick={() => onNavegar('ranking')}>Ranking</button>
    </div>
    <div className="logout-button">
      <button onClick={handleLogout}>Logout</button>
    </div>
  </div>
</nav>


  );
}

export default Navbar;
