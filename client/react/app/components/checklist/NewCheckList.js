import React from 'react';
import { Link } from 'react-router-dom';
import { extend, isNumber } from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ChecklistQuestion from './ChecklistQuestion';
import { fetchChecklistQuestions, createNewChecklist } from '../../helpers/checklist';
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
        return this.setState({ questions });
      })
      .catch(err => console.log('Error fetching checklist!', err));
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
        return history.push('/dashboard');
      })
      .catch(err => console.log('Error creating checklist!', err));
  }

  render() {
    const { questions, date } = this.state;

    return (
      <div className="default-container">
        <div className="checklist-header-container clearfix">
          <div className="checklist-header pull-left">
            <h1>
              <Link to="/checklists">
                <img className="back-icon" src="assets/back-arrow.svg" />
              </Link>
              Check-in
            </h1>

            <DatePicker
              selected={date}
              onChange={this.handleDateChange.bind(this)} />

            <h3 className="text-light">
              {date.format('dddd MMMM DD, YYYY')}
            </h3>
          </div>
        </div>

        <div className="checklist-container">
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

export default NewCheckList;
