import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { isNumber } from 'lodash';
import * as moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NavBar from '../navbar';
import ChecklistQuestion from './ChecklistQuestion';
import {
  IChecklist,
  IQuestion,
  fetchChecklist,
  updateChecklistScores
} from '../../helpers/checklist';
import { AppState, formatPoints } from '../../helpers/utils';
import { getChecklist } from '../../reducers';
import './CheckList.less';

interface ChecklistProps {
  checklist: IChecklist;
  date: moment.Moment;
  questions: IQuestion[];
  dispatch: (action: any) => any;
}

interface ChecklistState {
  checklist: IChecklist;
  date: moment.Moment;
  questions: IQuestion[];
}

// TODO: clean this up a bit... just using for caching right now
const mapStateToProps = (state: AppState) => {
  const { selected, checklists, questions: defaultQuestions } = state;
  const { date, checklist: selectedChecklist = {} as IChecklist } = selected;
  const { byId: checklistsById } = checklists;
  const { id: checklistId } = selectedChecklist;
  const checklist = checklistsById[checklistId] || {} as IChecklist;
  const { questions } = checklist;

  return {
    date,
    checklist,
    questions: questions || defaultQuestions
  };
};

class Checklist extends React.Component<
  ChecklistProps & RouteComponentProps<{ id: number }>,
  ChecklistState
> {
  constructor(props: ChecklistProps & RouteComponentProps<{ id: number }>) {
    super(props);
    const {
      checklist = {} as IChecklist,
      date = moment(),
      questions = [] as IQuestion[]
    } = this.props;

    this.state = {
      checklist,
      date,
      questions
    };
  }

  componentDidMount() {
    const { match, history, dispatch } = this.props;
    const { id } = match.params;

    dispatch(getChecklist(id));
    // In redux, cache questions with `id`, `text`, and `category` fields
    return fetchChecklist(id)
      .then(checklist => {
        const { questions, date } = checklist;

        return this.setState({ checklist, questions, date: moment(date) });
      })
      .catch(err => {
        // TODO: handle this at a higher level
        if (err.status === 401) {
          return history.push('/login');
        }

        console.log('Error fetching checklist!', err);
      });
  }

  handleScoreChange(question: IQuestion, score: number) {
    const { questions } = this.state;
    const update = questions.map(q => {
      return (q.id === question.id) ? { ...q, score } : q;
    });

    return this.setState({ questions: update });
  }

  calculateScore(questions: IQuestion[]) {
    return questions.reduce((score: number, question: IQuestion) => {
      return question.score ? (score + question.score) : score;
    }, 0);
  }

  submit() {
    const { questions, checklist } = this.state;
    const { history } = this.props;
    const { id: checklistId } = checklist;

    const scores = questions
      .filter(q => isNumber(q.score))
      .map(({ id, score, checklistScoreId }) => {
        return {
          score,
          checklistId,
          checklistScoreId,
          checklistQuestionId: id
        };
      });

    return updateChecklistScores(checklistId, { scores })
      .then(res => {
        return history.push('/dashboard');
      })
      .catch(err => console.log('Error updating scores!', err));
  }

  render() {
    const { questions, date } = this.state;
    const { history } = this.props;
    const points = this.calculateScore(questions);
    const isComplete = questions.every(q => isNumber(q.score));

    if (!questions || !questions.length) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <NavBar
          title='Check-in'
          linkTo='/dashboard'
          history={history} />

        <div className='default-container -narrow'>
          <div className='checklist-header-container clearfix'>
            <div className='checklist-header pull-left'>
              <h3 className='text-light'>
                {date.format('dddd MMMM DD, YYYY')}
              </h3>
            </div>

            <div className={`checklist-overview text-active pull-right ${
              isComplete ? '' : 'hidden'
            }`}>
              {formatPoints(points)}
            </div>
          </div>

          <div className='checklist-container'>
            {
              questions.map((question, key) => {
                return (
                  <ChecklistQuestion
                    key={key}
                    question={question}
                    onSelect={this.handleScoreChange.bind(this, question)} />
                );
              })
            }
          </div>

          <div className='clearfix'>
            <button
              className='btn-default pull-right'
              onClick={this.submit.bind(this)}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Checklist);
