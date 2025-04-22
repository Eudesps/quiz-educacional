import React, { useState, useEffect } from 'react';
import questions from './data/questions';
import Question from './components/Question';
import './App.css';

function App() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

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
  };

  return (
    <div className="App">
      {showIntro ? (
        <div className="intro-box">
          <h1 className="quiz-title">Quiz Educacional</h1>
          <button onClick={startQuiz}>Iniciar</button>
        </div>
      ) : (
        <div className="quiz-box">
          <h1 className="quiz-title">Quiz Educacional</h1>

          {current < questions.length ? (
            <>
              <div
                className="question-wrapper"
              >
                <Question
                  questionData={questions[current]}
                  onAnswer={handleAnswer}
                  selected={selected}
                  answered={answered}
                />
              </div>

              <button onClick={next} disabled={!answered}>Próxima</button>
            </>
          ) : (
            <div className="result-screen">
              <h2>Quiz finalizado!</h2>
              <p>Você acertou {score} de {questions.length} perguntas.</p>
              <button onClick={() => window.location.reload()}>Recomeçar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
