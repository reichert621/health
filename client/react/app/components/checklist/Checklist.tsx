import * as React from 'react';
import * as moment from 'moment';
import ChecklistQuestion from './ChecklistQuestion';
import { IQuestion, getDepressionLevelByScore } from '../../helpers/checklist';
import { formatPoints } from '../../helpers/utils';
import './Checklist.less';

interface ChecklistProps {
  date: moment.Moment;
  questions: IQuestion[];
  onScoreChange: (question: IQuestion, score: number) => void;
  onSubmit: () => Promise<void>;
}

class Checklist extends React.Component<ChecklistProps> {
  calculateScore(questions: IQuestion[]) {
    return questions.reduce((score: number, question: IQuestion) => {
      return question.score ? (score + question.score) : score;
    }, 0);
  }

  render() {
    const {
      questions,
      date,
      onScoreChange,
      onSubmit
    } = this.props;
    const points = this.calculateScore(questions);
    const description = getDepressionLevelByScore(points);

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

          <div className={'checklist-overview pull-right'}>
            <span className='text-active'>{formatPoints(points)}</span>
            <span> &mdash; {description}</span>
          </div>
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
  }
}

export default Checklist;
