import React from 'react';
import './Question.css';

const Question = ({ questionData, onAnswer, selected, answered }) => {
  return (
    <div className="question-container">
      <h2>{questionData.question}</h2>
      <div className="options">
        {questionData.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className={
              answered
                ? index === questionData.correct
                  ? 'correct'
                  : index === selected
                  ? 'wrong'
                  : ''
                : ''
            }
            disabled={answered}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Question;
