import React from 'react';
import { Link } from 'react-router-dom';
import { groupBy, keys, isNumber } from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import CheckListQuestion from './CheckListQuestion';
import { fetchChecklist, updateChecklistScores } from '../../helpers/checklist';
import 'react-datepicker/dist/react-datepicker.css';
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
    const { match } = this.props;
    const { id } = match.params;

    return fetchChecklist(id)
      .then(checklist => {
        const { questions, date } = checklist;

        return this.setState({ checklist, questions,  date: moment(date) });
      })
      .catch(err => console.log('Error fetching checklist!', err));
  }

  handleScoreChange(question, score) {
    const { questions } = this.state;
    const update = questions.map(q =>
      (q.id === question.id) ? { ...q, score } : q);

    return this.setState({ questions: update });
  }

  calculateScore(questions) {
    return questions.reduce((score, question) =>
      question.score ? (score + question.score) : score, 0);
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
        <Link to="/checklists">Back</Link>

        <h1>
          Depression Checklist
        </h1>

        <DatePicker
          selected={date}
          onChange={this.handleDateChange.bind(this)} />

        <div className="component-container">
          <table>
            <tbody>
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
            </tbody>
          </table>
        </div>

        <button
          className="button-default"
          onClick={this.submit.bind(this)}>
          Submit
        </button>

        <h2>
          Total Score: {this.calculateScore(questions)}
        </h2>
      </div>
    );
  }
}

export default CheckList;
