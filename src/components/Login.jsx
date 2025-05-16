// src/components/Login.js
import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, senha);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      }
      onLogin(userCredential.user);
    } catch (err) {
      setErro("Erro ao autenticar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="intro-box">
      <h1 className="quiz-title">{isLogin ? "Login" : "Cadastrar"}</h1>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px",
          width: "100%",
          maxWidth: "280px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px",
          width: "100%",
          maxWidth: "280px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      />
      <button
        onClick={handleAuth}
        style={{ width: "100%", maxWidth: "280px" }}
        disabled={loading}
      >
        {loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
      </button>
      <p style={{ marginTop: "10px", color: "white" }}>
        {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{ marginLeft: "8px", color: '#8ecae6', textDecoration: 'underline' }}
        >
          {isLogin ? "Cadastrar" : "Entrar"}
        </button>
      </p>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
};

export default Login;