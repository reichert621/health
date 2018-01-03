import React from 'react';
import { Link } from 'react-router-dom';
import { isNumber } from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CheckListQuestion from './CheckListQuestion';
import { fetchChecklist, updateChecklistScores } from '../../helpers/checklist';
import './CheckList.less';

class CheckList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checklist: {},
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

  handleScoreChange(question, score) {
    const { questions } = this.state;
    const update = questions.map(q => {
      return (q.id === question.id) ? { ...q, score } : q;
    });

    return this.setState({ questions: update });
  }

  calculateScore(questions) {
    return questions.reduce((score, question) => {
      return question.score ? (score + question.score) : score;
    }, 0);
  }

  handleDateChange(date) {
    this.setState({ date });
  }

  submit() {
    const { questions, date, checklist } = this.state;
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
    return updateChecklistScores(checklistId, { scores, date })
      .then(res => {
        console.log('Updated!', res);
        return history.push('/checklists');
      })
      .catch(err => console.log('Error updating scores!', err));
  }

  render() {
    const { questions, date } = this.state;

    return (
      <div className="default-container">
        <div className="checklist-header-container clearfix">
          <div className="checklist-header pull-left">
            <h1>
              <Link to="/dashboard">
                <img className="back-icon" src="assets/back-arrow.svg" />
              </Link>
              Check-in
            </h1>

            <div className="hidden">
              <DatePicker
                selected={date}
                onChange={this.handleDateChange.bind(this)} />
            </div>

            <h3 className="text-light">
              {date.format('dddd MMMM DD, YYYY')}
            </h3>
          </div>

          <div className="checklist-overview text-active pull-right">
            {this.calculateScore(questions)} points
          </div>
        </div>

        <div className="checklist-container">
          {
            questions.map((question, key) => {
              return (
                <CheckListQuestion
                  key={key}
                  question={question}
                  onSelect={this.handleScoreChange.bind(this, question)} />
              );
            })
          }
        </div>

        <div className="clearfix">
          <button
            className="btn-default pull-right"
            onClick={this.submit.bind(this)}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default CheckList;
