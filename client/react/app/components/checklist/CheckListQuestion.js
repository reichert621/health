import React from 'react';
import CheckListOptionsSvg from './CheckListOptionsSvg';

// TODO: update with descriptions (e.g. 0 = disagree, 1 = somewhat agree)
const getScoreDescriptions = () => {
  return [
    { value: 'zero', score: 0 },
    { value: 'one', score: 1 },
    { value: 'two', score: 2 },
    { value: 'three', score: 3 },
    { value: 'four', score: 4 }
  ];
};

const CheckListQuestion = ({ question, onSelect }) => {
  const options = getScoreDescriptions();

  return (
    <div className="checklist-question clearfix">
      <span className="pull-left">{question.text}</span>
      <span className="pull-right">
        <CheckListOptionsSvg
          num={question.score}
          handleSelect={onSelect} />
      </span>
    </div>
  );
};

export default CheckListQuestion;
