import React, { useState, useEffect } from 'react';
import questions from './data/questions';
import Question from './components/Question';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Ranking from './components/Ranking';
import { salvarPontuacao, buscarTopPontuacoes, salvarHistorico, buscarHistorico, auth, signInWithEmailAndPassword } from './firebase';
import './App.css';

// Função para embaralhar array (Fisher-Yates)
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

function App() {
  const [usuario, setUsuario] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [ranking, setRanking] = useState([]);
  const [tela, setTela] = useState('inicio'); // 'inicio', 'quiz', 'ranking', 'historico'
  const [historico, setHistorico] = useState([]); // Novo estado para armazenar o histórico
  const [quizFinalizado, setQuizFinalizado] = useState(false); // Novo estado para controlar se o quiz terminou
  const [loginError, setLoginError] = useState(null); // Novo estado para armazenar erros de login
  const [shuffledQuestions, setShuffledQuestions] = useState([]); // Novo estado para as perguntas embaralhadas

  // Função para embaralhar as perguntas e definir o estado
  const shuffleQuestions = () => {
    const newShuffledQuestions = shuffleArray(questions);
    setShuffledQuestions(newShuffledQuestions);
    setCurrent(0); // Reinicia o índice da pergunta atual
    setAnswered(false);
    setSelected(null);
  };

  useEffect(() => {
    if (tela === 'quiz') {
      shuffleQuestions(); // Embaralha as perguntas quando o quiz começa
    }
  }, [tela]);

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
    setQuizFinalizado(false); // Reinicia o estado ao iniciar o quiz
  };

  const handleLogin = (user) => {
    if (user && user.error) {
      setLoginError(user.error); // Armazena o erro de login
      setUsuario(null); // Limpa o usuário em caso de erro
    } else {
      setUsuario(user);
      setLoginError(null); // Limpa o erro se o login for bem-sucedido
    }
  };

  const handleLogout = () => {
    setUsuario(null);
    setCurrent(0);
    setScore(0);
    setShowIntro(true);
    setTela('inicio');
  };

  const finalizarQuiz = () => {
    if (usuario) {
      salvarPontuacao(usuario.email, score);
      salvarHistorico(usuario.email, score); // Salva a pontuação final
    }
    setTela('inicio');
    setQuizFinalizado(true); // Define o estado para indicar que o quiz terminou
  };

  const navegar = async (novaTela) => {
    setTela(novaTela);

    if (novaTela === 'ranking') {
      const top = await buscarTopPontuacoes();
      setRanking(top);
    }

    if (novaTela === 'historico') {
      // Busca o histórico do usuário ao navegar para a tela de histórico
      if (usuario) {
        const historicoData = await buscarHistorico(usuario.email);
        setHistorico(historicoData);
      }
    }


    if (novaTela === 'inicio') {
      setShowIntro(true);
      setCurrent(0);
      setScore(0);
      setQuizFinalizado(false); // Reinicia o estado ao voltar para o início
    }
  };

  if (!usuario) {
    return <Login onLogin={handleLogin} error={loginError} />; // Passa o erro para o componente Login
  }

  return (
    <div className="App">
      <Navbar onLogout={handleLogout} onNavegar={navegar} />

      {tela === 'ranking' && <Ranking rankingData={ranking} />}

      {tela === 'historico' && (
        <div className="quiz-box">
          <h1 className="quiz-title">Histórico de Pontuações</h1> {/* Título atualizado */}
          {historico.length > 0 ? (
            <ol>
              {historico.map((jogada, index) => (
                <li key={index}>
                  {/* Exibe apenas a pontuação e a data */}
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
          <h1 className="quiz-title">Quizz</h1>
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
          <button onClick={() => window.location.reload()}>Recomeçar</button>
          <button onClick={finalizarQuiz}>
            Salvar pontuação
          </button>
        </div>
      )}
    </div>
  );
}

export default App;