//src/components/Ranking.js

import React, { useEffect, useState } from 'react';
import { buscarTopPontuacoes } from '../firebase';

const Ranking = () => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    buscarTopPontuacoes().then(setRanking);
  }, []);

  return (
    <div className="quiz-box">
      <h1 className="quiz-title">Ranking</h1>
      <ol>
        {ranking.map((item, index) => (
          <li key={index}>
            {item.usuario}: {item.pontos} pontos
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Ranking;
