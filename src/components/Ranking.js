//src/components/Ranking.js

import React, { useEffect, useState } from 'react';
import { buscarTopPontuacoes } from '../firebase';
import './Ranking.css';

const Ranking = () => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    buscarTopPontuacoes().then(setRanking);
  }, []);

return (
  <div className="ranking-container">
    <h1 className="ranking-title">Ranking</h1>
    <ol className="ranking-list">
      {ranking.map((item, index) => (
        <li key={index}>
          <span>{index + 1}. {item.usuario}</span>
          <span>{item.pontos} pts</span>
        </li>
      ))}
    </ol>
  </div>
);
};

export default Ranking;
