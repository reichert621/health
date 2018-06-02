import * as React from 'react';
import * as moment from 'moment';
import ChecklistQuestion from './ChecklistQuestion';
import { IQuestion } from '../../helpers/checklist';
import { getDescriptionByAssessmentType } from '../../helpers/assessment';
import { formatPoints } from '../../helpers/utils';
import './Checklist.less';

const calculateScore = (questions: IQuestion[]) => {
  return questions.reduce((score: number, question: IQuestion) => {
    return question.score ? (score + question.score) : score;
  }, 0);
};

const ChecklistOverview = ({ questions }: { questions: IQuestion[] }) => {
  const [{ type: assessmentType }] = questions;
  const points = calculateScore(questions);
  const description = getDescriptionByAssessmentType(assessmentType, points);

  return (
    <div className={'checklist-overview pull-right'}>
      <span className='text-active'>{formatPoints(points)}</span>
      <span> &mdash; {description}</span>
    </div>
  );
};

interface ChecklistProps {
  date: moment.Moment;
  questions: IQuestion[];
  onScoreChange: (question: IQuestion, score: number) => void;
  onSubmit: () => Promise<void>;
}

const Checklist = ({
  questions,
  date,
  onScoreChange,
  onSubmit
}: ChecklistProps) => {
  if (!questions || !questions.length) {
    return null;
  }

  return (
    <div className='default-container checklist-v1'>
      <div className='checklist-header-container clearfix'>
        <div className='checklist-header pull-left'>
          <h3 className='text-light'>
            {date.format('dddd MMMM DD, YYYY')}
          </h3>
        </div>

        <ChecklistOverview questions={questions} />
      </div>

      <div className='checklist-container'>
        {
          questions.map((question, key) => {
            return (
              <ChecklistQuestion
                key={key}
                question={question}
                onSelect={score => onScoreChange(question, score)} />
            );
          })
        }
      </div>

      <div className='clearfix'>
        <button
          className='btn-default pull-right'
          onClick={onSubmit}>
          Done
        </button>
      </div>
    </div>
  );
};

export default Checklist;
