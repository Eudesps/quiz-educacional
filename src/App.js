import React, { useState, useEffect, useCallback } from 'react';
import questions from './data/questions';
import Question from './components/Question';
import Login from './components/Login'; // Importa o componente Login
import Navbar from './components/Navbar';
import Ranking from './components/Ranking';
import { salvarPontuacao, buscarTopPontuacoes, salvarHistorico, buscarHistorico } from './firebase';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [usuario, setUsuario] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')) : null;
    }
    return null;
  });

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('showIntro') ? JSON.parse(localStorage.getItem('showIntro')) : true;
    }
    return true;
  });
  const [ranking, setRanking] = useState([]);
  const [tela, setTela] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tela') || 'inicio';
    }
    return 'inicio'
  }); // Persiste a tela atual
  const [historico, setHistorico] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Função para embaralhar as perguntas e definir o estado
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  const shuffleQuestions = useCallback(() => {
      const newShuffledQuestions = shuffleArray(questions);
      setShuffledQuestions(newShuffledQuestions);
      setCurrent(0);
      setAnswered(false);
      setSelected(null);
  }, []);


  useEffect(() => {
    if (tela === 'quiz') {
      shuffleQuestions();
    }
  }, [tela, shuffleQuestions]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tela', tela);
      localStorage.setItem('showIntro', JSON.stringify(showIntro));
      if (usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
      } else {
        localStorage.removeItem('usuario');
      }
    }
  }, [tela, showIntro, usuario]);

  const handleAnswer = (index) => {
    setSelected(index);
    setAnswered(true);
    const isCorrect = index === shuffledQuestions[current].correct;
    if (isCorrect) {
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
    if (user) {
      setUsuario(user);
    } else {
      setUsuario(null);
    }
  };

  const handleLogout = () => {
    setUsuario(null);
    setCurrent(0);
    setScore(0);
    setShowIntro(true);
    setTela('inicio');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuario');
    }

  };

  const finalizarQuiz = () => {
    if (usuario) {
      salvarPontuacao(usuario.email, score);
      salvarHistorico(usuario.email, score);
      toast.success("Pontuação salva com sucesso!");
    }
  };

  const navegar = async (novaTela) => {
    setTela(novaTela);

    if (novaTela === 'ranking') {
      const top = await buscarTopPontuacoes();
      setRanking(top);
    }

    if (novaTela === 'historico') {
      if (usuario) {
        const historicoData = await buscarHistorico(usuario.email);
        setHistorico(historicoData);
      }
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

      <ToastContainer position="top-center" autoClose={2000} />
      <Navbar onLogout={handleLogout} onNavegar={navegar} />

      {tela === 'ranking' && <Ranking rankingData={ranking} />}

      {tela === 'historico' && (
        <div className="quiz-box">
          <h1 className="quiz-title">Histórico de Pontuações</h1>
          {historico.length > 0 ? (
            <ol>
              {historico.map((jogada, index) => (
                <li key={index}>
                  <p>
                    <strong>Pontuação:</strong> {jogada.pontos} - {jogada.data}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p>Você ainda não possui histórico de jogadas.</p>
          )}
        </div>
      )}

      {tela === 'inicio' && showIntro && (
        <div className="intro-box">
          <h1 className="quiz-title">Quiz</h1>
          <button onClick={startQuiz}>Iniciar</button>
        </div>
      )}

      {tela === 'quiz' && current < shuffledQuestions.length && (
        <div className="quiz-box">
          <Question
            questionData={shuffledQuestions[current]}
            onAnswer={handleAnswer}
            selected={selected}
            answered={answered}
          />
          <button onClick={next} disabled={!answered}>
            Próxima
          </button>
        </div>
      )}

      {tela === 'quiz' && current >= shuffledQuestions.length && (
        <div className="result-screen">
          <h2>Quiz finalizado!</h2>
          <p>
            Você acertou {score} de {shuffledQuestions.length} perguntas.
          </p>
          <button onClick={finalizarQuiz}>
            Salvar pontuação
          </button>
        </div>
      )}
    </div>
  );
}

export default App;