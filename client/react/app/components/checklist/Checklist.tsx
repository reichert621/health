import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
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
import { formatPoints } from '../../helpers/utils';
import './CheckList.less';

interface ChecklistState {
  checklist: IChecklist;
  date: moment.Moment;
  questions: IQuestion[];
}

class Checklist extends React.Component<RouteComponentProps<{ id: number }>, ChecklistState> {
  constructor(props: RouteComponentProps<{ id: number }>) {
    super(props);

    this.state = {
      checklist: null,
      date: moment(),
      questions: []
    };
  }

  componentDidMount() {
    const { match, history } = this.props;
    const { id } = match.params;

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

  handleDateChange(date: moment.Moment) {
    this.setState({ date });
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

    console.log('Submitting!', scores);
    return updateChecklistScores(checklistId, { scores })
      .then(res => {
        console.log('Updated!', res);
        return history.push('/dashboard');
      })
      .catch(err => console.log('Error updating scores!', err));
  }

  render() {
    const { questions, date } = this.state;
    const { history } = this.props;
    const points = this.calculateScore(questions);

    return (
      <div>
        <NavBar
          title='Check-in'
          linkTo='/dashboard'
          history={history} />

        <div className='default-container -narrow'>
          <div className='checklist-header-container clearfix'>
            <div className='checklist-header pull-left'>
              <div className='hidden'>
                <DatePicker
                  selected={date}
                  onChange={this.handleDateChange.bind(this)} />
              </div>

              <h3 className='text-light'>
                {date.format('dddd MMMM DD, YYYY')}
              </h3>
            </div>

            <div className='checklist-overview text-active pull-right'>
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

export default Checklist;
