import React from 'react';
import './Inicio.css';

export default function Inicio({ onStart }) {
  return (
    <div className="intro-box001">
      <h1 className="quiz-title">Quiz App - Breves instruções</h1>

      <div className="intro-description">
        <p>
          Bem-vindo à nossa plataforma <strong>gamificada</strong> com quizzes interativos!
        </p>
        <p>
          Ao final das questões, você verá sua <strong>pontuação final</strong> e será incluído em um <strong>ranking</strong> com outros participantes.
          Cada resposta gera <strong>feedback imediato</strong>, como no exemplo abaixo (exemplo caso a resposta esteja errada)oxente:
        </p>

        <div className="feedback-simulacao">
          <div className="option animated correct">Alternativa correta</div>
          <div className="option animated incorrect selected">Sua resposta</div>
          <div className="option">Alternativa neutra</div>
        </div>

        <p>Boa sorte e divirta-se aprendendo!</p>
      </div>

      <div className="intro-buttons">
        <button onClick={onStart}>Iniciar Quiz</button>
      </div>
    </div>
  );
}
