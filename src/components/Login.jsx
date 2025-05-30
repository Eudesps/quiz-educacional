// src/components/Login.js
import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase'; // Certifique-se de que estas funções são exportadas de firebase.js

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [erro, setErro] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const handleAuth = async () => {
    setErro(''); 
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
      console.error("Erro ao autenticar:", err);
      let errorMessage = "Erro desconhecido. Tente novamente.";

      // Mapeia os códigos de erro do Firebase para mensagens amigáveis
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = "O endereço de e-mail está mal formatado.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Esta conta de usuário foi desativada.";
          break;
        case 'auth/user-not-found':
          errorMessage = "Nenhum usuário encontrado com este e-mail.";
          break;
        case 'auth/wrong-password':
          errorMessage = "A senha está incorreta.";
          break;
        case 'auth/email-already-in-use':
          errorMessage = "Este e-mail já está em uso.";
          break;
        case 'auth/weak-password':
          errorMessage = "A senha deve ter pelo menos 6 caracteres.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Erro de rede. Verifique sua conexão e tente novamente.";
          break;
        case 'auth/invalid-credential': // Novo tratamento de erro
          errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha.";
          break;
        case 'auth/missing-password': // Novo tratamento de erro
          errorMessage = "A senha não pode estar vazia.";
          break;
        case 'auth/operation-not-allowed': // Novo tratamento de erro
          errorMessage = "Autenticação por e-mail/senha não está habilitada. Contate o suporte.";
          break;
        default:
          errorMessage = "Erro ao autenticar: " + err.message;
          break;
      }
      setErro(errorMessage); 
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
          style={{ marginLeft: "8px", color: '#0f172a', textDecoration: 'underline' }}
          disabled={loading}
        >
          {isLogin ? "Cadastrar" : "Entrar"}
        </button>
      </p>
      {erro && <p style={{ color: "red", marginTop: "10px" }}>{erro}</p>} {/* Exibe a mensagem de erro */}
    </div>
  );
}

export default Login;