import React from 'react';
import { Link } from 'react-router-dom';
import { groupBy, keys } from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TaskCheckbox from './TaskCheckbox';
import { calculateScore } from '../../helpers/tasks';
import {
  fetchScorecard,
  updateScoreCard,
  toggleScorecardTask
} from '../../helpers/scorecard';
import './ScoreCard.less';

class ScoreCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scorecard: {},
      date: moment(),
      tasks: []
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { id } = match.params;

    return fetchScorecard(id)
      .then(scorecard => {
        const { tasks, date } = scorecard;

        return this.setState({ scorecard, tasks, date: moment(date) });
      })
      .catch(err => {
        console.log('Error fetching scorecard!', err);
      });
  }

  handleCheckboxUpdate(task) {
    const { tasks, scorecard } = this.state;
    const { id: scorecardId } = scorecard;
    const { id: taskId, isComplete: isCurrentlyComplete = false } = task;
    const isComplete = !isCurrentlyComplete;

    return toggleScorecardTask(scorecardId, taskId, isComplete)
      .then(() => {
        const update = tasks.map(t => {
          return (t.id === taskId) ? { ...t, isComplete } : t;
        });

        return this.setState({ tasks: update });
      })
      .catch(err => {
        console.log('Error toggling task checkbox!', err);
      });
  }

  handleDateChange(date) {
    const { scorecard } = this.state;
    const { id: scorecardId } = scorecard;

    return updateScoreCard(scorecardId, { date })
      .then(scorecard => {
        this.setState({ date });
      })
      .catch(err => {
        console.log('Error updating date!', err);
      });
  }

  renderCheckboxes() {
    const { tasks } = this.state;
    const grouped = groupBy(tasks, 'category');
    const categories = keys(grouped);

    return categories.map((category, index) => {
      const subtasks = grouped[category];
      const score = calculateScore(subtasks);

      return (
        <div key={index}>
          <h5 className="category-label">
            <span>{category}</span>
            <span className="score-details">(score: {score})</span>
          </h5>
          {
            subtasks.map((task, key) => {
              return (
                <TaskCheckbox
                  key={key}
                  task={task}
                  onToggle={this.handleCheckboxUpdate.bind(this, task)} />
              );
            })
          }
        </div>
      );
    });
  }

  render() {
    const { tasks, date } = this.state;

    return (
      <div className="default-container">
        <Link to="/scorecards">Back</Link>

        <h1>
          Scorecard
        </h1>

        <DatePicker
          selected={date}
          onChange={this.handleDateChange.bind(this)} />

        <div className="component-container">
          {this.renderCheckboxes()}
        </div>

        <h2>
          Total Score: {calculateScore(tasks)}
        </h2>
      </div>
    );
  }
}

export default ScoreCard;
