import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      onLogin(); // ex: navega para quiz
    } catch (error) {
      alert("Erro no login: " + error.message);
    }
  };

  return (
    <div className="intro-box">
      <h2>Login</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" onChange={e => setSenha(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
