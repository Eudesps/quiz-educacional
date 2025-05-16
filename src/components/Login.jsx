// src/components/Login.jsx
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [erro, setErro] = useState('');

  const handleAuth = async () => {
    try {
     let userCredential;
    if (isLogin) {
      userCredential = await signInWithEmailAndPassword(auth, email, senha);
    } else {
      userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    }
    onLogin(userCredential.user); // ← Aqui está a correção!
  } catch (err) {
    setErro("Erro ao autenticar: " + err.message);
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
    maxWidth: "280px", // ← Limita o tamanho do campo
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
    maxWidth: "280px", // ← Limita também o campo da senha
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  }}
/>
      <button onClick={handleAuth} style={{width: "100%", maxWidth: "280px"}}>
        {isLogin ? "Entrar" : "Cadastrar"}
      </button>
      <p style={{ marginTop: "10px", color: "white" }}>
        {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
        <button onClick={() => setIsLogin(!isLogin)} style={{ marginLeft: "8px"}}>
          {isLogin ? "Cadastrar" : "Entrar"}
        </button>
      </p>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}

export default Login;
