import React from 'react';
import { Link } from 'react-router-dom';
import { extend, groupBy, keys, isNumber } from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import CheckListQuestion from './CheckListQuestion';
import { fetchChecklistQuestions, createNewChecklist } from '../../helpers/checklist';
import 'react-datepicker/dist/react-datepicker.css';
import './CheckList.less';

// TODO: this component is extremely similar to the Checklist component,
// might be worth DRYing up or distinguishing between the two better
class NewCheckList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: moment(),
      questions: []
    };
  }

  componentDidMount() {
    return fetchChecklistQuestions()
      .then(questions => {
        return this.setState({
          questions: questions.map(question => extend(question, { score: 0 }))
        });
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
    const { questions, date } = this.state;
    const { history } = this.props;
    const scores = questions
      .filter(q => isNumber(q.score))
      .map(({ id, score }) => {
        return {
          score,
          checklistQuestionId: id
        };
      });

    console.log('Submitting!', scores);
    return createNewChecklist({ date, scores })
      .then(({ id }) => {
        console.log('Created!', id);
        return history.push('/checklists');
      })
      .catch(err => console.log('Error creating checklist!', err));
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

export default NewCheckList;
