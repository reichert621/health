import * as React from 'react';
import * as moment from 'moment';
import { isNumber } from 'lodash';
import ChecklistFlowQuestion from './ChecklistFlowQuestion';
import {
  IChecklist,
  IQuestion,
} from '../../helpers/checklist';
import './Checklist.less';

// TODO: DRY up in other places
const INACTIVE_COLOR = '#D2D2D2';
const ACTIVE_COLORS = ['#B8DBE9', '#8BC9E1', '#72BFDB', '#4FAED1', '#33A2CC'];

interface ChecklistProgressProps {
  currentIndex: number;
  questions: IQuestion[];
}

const ChecklistProgressLabel = ({
  currentIndex,
  questions = []
}: ChecklistProgressProps) => {
  if (!questions || !questions.length) {
    return null;
  }

  const currentQuestion = questions[currentIndex];
  const count = questions.length;
  const { category } = currentQuestion;

  return (
    <div className='checklist-progress-container text-center'>
      <div className='checklist-category'>{category}</div>
      <div className='checklist-progress-label'>
        Question <span className='text-blue'>{currentIndex + 1}</span> / {count}
      </div>
    </div>
  );
};

const ChecklistProgressBar = ({
  currentIndex,
  questions = []
}: ChecklistProgressProps) => {
  if (!questions || !questions.length) {
    return null;
  }

  const count = questions.length;
  const width = 100 / count;

  return (
    <div className='checklist-progress-container text-center'>
      <div className='checklist-progress-bar clearfix'>
        {
          questions.map((question, key) => {
            const { score } = question;
            const isActive = (currentIndex === key);
            const style = {
              width: `${width}%`,
              borderBottom: isActive ? '1px solid #979797' : 'none',
              backgroundColor: (isNumber(score) && !!ACTIVE_COLORS[score])
                ? ACTIVE_COLORS[score]
                : INACTIVE_COLOR
            };

            return (
              <div key={key}
                style={style}
                className='checklist-progress-segment pull-left'>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

interface ChecklistProps {
  date: moment.Moment;
  questions: IQuestion[];
  onScoreChange: (question: IQuestion, score: number) => void;
  onSubmit: () => Promise<void>;
}

interface ChecklistState {
  currentIndex: number;
}

class ChecklistFlow extends React.Component<ChecklistProps, ChecklistState> {
  handleKeyDown: (e: any) => void;

  constructor(props: ChecklistProps) {
    super(props);

    const { questions = [] } = props;
    const currentIndex = questions.reduce((current, { score }, index) => {
      if (current > -1) {
        return current;
      } else {
        return isNumber(score) ? current : index;
      }
    }, -1);

    this.handleKeyDown = this.onKeyDown.bind(this);
    this.state = { currentIndex };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  // TODO: update type
  onKeyDown(e: any) {
    const { onSubmit } = this.props;

    switch (e.key) {
      case 'ArrowRight':
        return this.setNextQuestion();
      case 'ArrowLeft':
        return this.setPreviousQuestion();
      case 'Enter':
        return this.isLastIndex() ? onSubmit() : this.setNextQuestion();
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        return this.handleKeyboardScoreChange(e);
      default:
        return null;
    }
  }

  isLastIndex() {
    const { currentIndex } = this.state;
    const { questions } = this.props;

    return currentIndex === questions.length - 1;
  }

  getNextIndex() {
    const { currentIndex } = this.state;
    const { questions } = this.props;

    return currentIndex < questions.length - 1
      ? currentIndex + 1
      : currentIndex;
  }

  setNextQuestion() {
    return this.setState({ currentIndex: this.getNextIndex() });
  }

  getPreviousIndex() {
    const { currentIndex } = this.state;

    return currentIndex > 0 ? currentIndex - 1 : currentIndex;
  }

  setPreviousQuestion() {
    return this.setState({ currentIndex: this.getPreviousIndex() });
  }

  // TODO: update type
  handleKeyboardScoreChange(e: any) {
    const score = Number(e.key) - 1;
    const { currentIndex } = this.state;
    const { questions, onScoreChange } = this.props;
    const question = questions[currentIndex];

    return this.handleScoreChange(question, score);
  }

  handleScoreChange(question: IQuestion, score: number) {
    const { onScoreChange } = this.props;

    onScoreChange(question, score);

    setTimeout(() => this.setNextQuestion(), 400);
  }

  render() {
    const { currentIndex } = this.state;
    const {
      questions,
      date,
      onScoreChange,
      onSubmit
    } = this.props;

    if (!questions || !questions.length) {
      return null;
    }

    return (
      <div className='default-container -narrow checklist-v2'>
        <div className='checklist-header-container clearfix'>
          <div className='checklist-header pull-left'>
            <h3 className='text-light'>
              {date.format('dddd MMMM DD, YYYY')}
            </h3>
          </div>
        </div>

        <ChecklistProgressLabel
          currentIndex={currentIndex}
          questions={questions} />

        <div className='checklist-container clearfix'>
          {
            questions.map((question, key) => {
              const offset = (key - currentIndex) * 60;

              return (
                <ChecklistFlowQuestion
                  key={key}
                  question={question}
                  offset={offset}
                  onSelect={score => this.handleScoreChange(question, score)} />
              );
            })
          }
        </div>

        <div className='clearfix'>
          <button
            className={`btn-default pull-left ${
              (currentIndex === 0) ? 'hidden' : ''
            }`}
            onClick={e => this.setPreviousQuestion()}>
            Previous
          </button>

          <button
            className={`btn-default pull-right ${
              (currentIndex === questions.length - 1) ? 'hidden' : ''
            }`}
            onClick={e => this.setNextQuestion()}>
            Next
          </button>

          <button
            className={`btn-primary pull-right ${
              (currentIndex === questions.length - 1) ? '' : 'hidden'
            }`}
            onClick={onSubmit}>
            Done
          </button>
        </div>

        <ChecklistProgressBar
          currentIndex={currentIndex}
          questions={questions} />
      </div>
    );
  }
}

export default ChecklistFlow;
