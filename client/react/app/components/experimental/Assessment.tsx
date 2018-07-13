import * as React from 'react';
import * as moment from 'moment';
import { isNumber } from 'lodash';
import AssessmentQuestion from './AssessmentQuestion';
import { IQuestion } from '../../helpers/checklist';
import './Assessment.less';

interface AssessmentProps {
  date: moment.Moment;
  questions: IQuestion[];
  onToggleDisplay?: () => void;
  onScoreChange: (question: IQuestion, score: number) => void;
  onSubmit: () => Promise<void>;
}

const Assessment = ({
  questions,
  date,
  onToggleDisplay,
  onScoreChange,
  onSubmit
}: AssessmentProps) => {
  if (!questions || !questions.length) {
    return null;
  }

  const isComplete = questions.every(q => isNumber(q.score));
  const current = questions.find(q => !isNumber(q.score)); // TODO

  return (
    <div className='default-container'>
      <div className='assessment-header-container clearfix'>
        <div className='assessment-header pull-left'>
          <h3 className='text-light'>
            {date.format('dddd MMMM DD, YYYY')}
          </h3>
        </div>
      </div>

      <div className='assessment-container'>
        {
          questions.map((question, key) => {
            const isCurrent = current && (question.id === current.id);

            return (
              <AssessmentQuestion
                key={key}
                question={question}
                isCurrent={isCurrent}
                onSelect={score => onScoreChange(question, score)} />
            );
          })
        }
      </div>

      <div className='clearfix'>
        <button
          className='btn-link assessment-btn-link pull-right'
          onClick={onSubmit}>
          I'm done
        </button>
      </div>
    </div>
  );
};

export default Assessment;
