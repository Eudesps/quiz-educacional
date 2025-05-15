//src/App.js

import React, { useState } from 'react';
import questions from './data/questions';
import Question from './components/Question';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Ranking from './components/Ranking';
import { salvarPontuacao, buscarTopPontuacoes } from './firebase';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [ranking, setRanking] = useState([]);
  const [tela, setTela] = useState('inicio'); // 'inicio', 'quiz', 'ranking', 'historico'

  const handleAnswer = (index) => {
    setSelected(index);
    setAnswered(true);
    if (index === questions[current].correct) {
      setScore(score + 1);
    }
  };

  const next = () => {
    setSelected(null);
    setAnswered(false);
    setCurrent(current + 1);
  };

  const startQuiz = () => {
    setShowIntro(false);
    setTela('quiz');
  };

  const handleLogin = (user) => {
    setUsuario(user);
  };

  const handleLogout = () => {
    setUsuario(null);
    setCurrent(0);
    setScore(0);
    setShowIntro(true);
    setTela('inicio');
  };

  const finalizarQuiz = () => {
    console.log("finalizarQuiz chamado");
    if (usuario) {
      salvarPontuacao(usuario.email, score);
    }
    setTela('inicio');
  };

  const navegar = async (novaTela) => {
    setTela(novaTela);

    if (novaTela === 'ranking') {
      const top = await buscarTopPontuacoes();
      setRanking(top);
    }

    if (novaTela === 'inicio') {
      setShowIntro(true);
      setCurrent(0);
      setScore(0);
    }
  };

  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Navbar onLogout={handleLogout} onNavegar={navegar} />

      {tela === 'ranking' && <Ranking rankingData={ranking} />}

      {tela === 'inicio' && showIntro && (
        <div className="intro-box">
          <h1 className="quiz-title">Quizz</h1>
          <button onClick={startQuiz}>Iniciar</button>
        </div>
      )}

      {tela === 'quiz' && current < questions.length && (
        <div className="quiz-box">
          <Question
            questionData={questions[current]}
            onAnswer={handleAnswer}
            selected={selected}
            answered={answered}
          />
          <button onClick={next} disabled={!answered}>Próxima</button>
        </div>
      )}

      {tela === 'quiz' && current >= questions.length && (
        <div className="result-screen">
          <h2>Quiz finalizado!</h2>
          <p>Você acertou {score} de {questions.length} perguntas.</p>
          <button onClick={() => window.location.reload()}>Recomeçar</button>
          <button onClick={finalizarQuiz}>Salvar pontuação</button>
        </div>
      )}
    </div>
  );
}

export default App;
