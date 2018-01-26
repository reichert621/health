import * as React from 'react';
import { isNumber } from 'lodash';
import { IQuestion } from '../../helpers/checklist';
import ChecklistOptionsSvg from './ChecklistOptionsSvg';

const getScoreDescription = (score: number): string => {
  return [
    'disagree',
    'somewhat agree',
    'agree',
    'strongly agree',
    'very strongly agree'
  ][score] || 'unanswered';
};

interface ChecklistQuestionProps {
  question: IQuestion;
  onSelect: (value: number) => void;
}

const ChecklistQuestion = ({ question, onSelect }: ChecklistQuestionProps) => {
  const { text, score } = question;

  return (
    <div className='checklist-question-container clearfix'>
      <span className='checklist-question pull-left'>{text}</span>
      <span className='checklist-selector pull-right'>
        <ChecklistOptionsSvg
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

export default ChecklistQuestion;
