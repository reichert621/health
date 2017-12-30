import React from 'react';

const getScoreOptions = () => {
  return [
    { value: 'zero', score: 0 },
    { value: 'one', score: 1 },
    { value: 'two', score: 2 },
    { value: 'three', score: 3 },
    { value: 'four', score: 4 }
  ];
};

const CheckListQuestion = ({ question, onSelect }) => {
  const options = getScoreOptions();

  return (
    <tr>
      <td>{question.text}</td>
      {
        options.map((option, key) => {
          const { value, score } = option;

          return (
            <td key={key}>
              <label>
                <input
                  type="radio"
                  value={value}
                  checked={question.score === score}
                  onChange={(e) => onSelect(score)} />
              </label>
            </td>
          );
        })
      }
    </tr>
  );
};

export default CheckListQuestion;
