import React from 'react';
import { isNumber } from 'lodash';
import CheckListOptionsSvg from './CheckListOptionsSvg';

const getScoreDescription = (score) => {
  return [
    'disagree',
    'somewhat agree',
    'agree',
    'strongly agree',
    'very strongly agree'
  ][score] || 'unanswered';
};

const CheckListQuestion = ({ question, onSelect }) => {
  const { text, score } = question;

  return (
    <div className="checklist-question-container clearfix">
      <span className="checklist-question pull-left">{text}</span>
      <span className="checklist-selector pull-right">
        <CheckListOptionsSvg
          selected={score}
          handleSelect={onSelect} />
      </span>
      <span
        className={`checklist-answer pull-right ${
          isNumber(score) ? 'text-active' : 'text-inactive'
        }`}>
        {getScoreDescription(score)}
      </span>
    </div>
  );
};

export default CheckListQuestion;
