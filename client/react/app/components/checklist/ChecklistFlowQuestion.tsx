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
  offset: number;
  onSelect: (value: number) => void;
}

const ChecklistFlowQuestion = ({ question, onSelect, offset }: ChecklistQuestionProps) => {
  const { id, text, score } = question;

  return (
    <div className='checklist-question-container clearfix'
      style={{ left: `${offset}%`, opacity: offset ? 0 : 1 }}>
      <div className='checklist-question'>{text}</div>
      <div className='checklist-selector'>
        <ChecklistOptionsSvg
          selected={score}
          handleSelect={onSelect} />
      </div>
      <div
        className={`checklist-answer ${
          isNumber(score) ? 'text-active' : 'text-inactive'
        }`}>
        {getScoreDescription(score)}
      </div>
    </div>
  );
};

export default ChecklistFlowQuestion;
