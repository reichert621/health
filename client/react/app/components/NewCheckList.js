import React from 'react';
import { Link } from 'react-router-dom';
import { groupBy, keys, isNumber } from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { fetchChecklistQuestions, createNewChecklist } from '../helpers/checklist';
import 'react-datepicker/dist/react-datepicker.css';
import './CheckList.less';

const getScoreOptions = () => {
  return [
    { value: 'zero', score: 0 },
    { value: 'one', score: 1 },
    { value: 'two', score: 2 },
    { value: 'three', score: 3 },
    { value: 'four', score: 4 }
  ];
};

const ChecklistQuestion = ({ question, onSelect }) => {
  const options = getScoreOptions();
  const style = {
    marginRight: 10
  };

  return (
    <div>
      <span style={style}>{question.text}</span>
      <span style={style}>
        {
          options.map((option, key) => {
            const { value, score } = option;

            return (
              <label key={key}>
                <input
                  type="radio"
                  value={value}
                  checked={question.score === score}
                  onChange={(e) => onSelect(score)} />
              </label>
            )
          })
        }
      </span>
    </div>
  );
};

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
        return this.setState({ questions });
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
        return history.push(`/checklist/${id}`);
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
