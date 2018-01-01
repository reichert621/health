import React from 'react';

// TODO: deprecate if no longer needed
const CheckListQuestion = ({ num, handleSelect }) => {
  const options = [0, 1, 2, 3, 4];

  return (
    <div className="checklist-options-container">
      <img
        className="checklist-option-icon"
        src={`assets/checkin-${num}.svg`} />
      {
        options.map((n, key) => {
          return (
            <div key={key}
              className="checklist-option"
              onClick={handleSelect}
              style={
                { left: `${n * 28}px` }
              } />
          );
        })
      }
    </div>
  );
};

export default CheckListQuestion;
