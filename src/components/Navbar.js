// src/components/Navbar.js
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './Navbar.css'; // opcional

function Navbar({ onLogout, onNavegar }) {
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
  <h2>Quiz App</h2>
  <div className="nav-container">
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
