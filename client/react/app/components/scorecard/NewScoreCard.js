import React from 'react';
import { Link } from 'react-router-dom';
import { groupBy, keys } from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TaskCheckbox from './TaskCheckbox';
import { fetchTasks } from '../../helpers/tasks';
import { createNewScorecard } from '../../helpers/scorecard';
import './ScoreCard.less';

// TODO: this component is extremely similar to the ScoreCard component,
// might be worth DRYing up or distinguishing between the two better
class NewScoreCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: moment(),
      tasks: []
    };
  }

  componentDidMount() {
    return fetchTasks()
      .then(tasks => {
        return this.setState({ tasks });
      })
      .catch(err => console.log('Error fetching scorecard!', err));
  }

  handleCheckboxUpdate(task) {
    const { tasks } = this.state;
    const update = tasks.map(t =>
      (t.id === task.id) ? { ...t, isComplete: !t.isComplete } : t);

    return this.setState({ tasks: update });
  }

  calculateScore(tasks) {
    return tasks.reduce((score, task) => {
      const { isComplete, points } = task;

      return isComplete ? (score + points) : score;
    }, 0);
  }

  handleDateChange(date) {
    this.setState({ date });
  }

  submit() {
    const { tasks, date } = this.state;
    const { history } = this.props;
    const selectedTasks = tasks
      .filter(t => t.isComplete)
      .map(({ id: taskId, description }) => {
        return { taskId, description };
      });

    console.log('Submitting!', selectedTasks);
    return createNewScorecard({ date, selectedTasks })
      .then(({ id }) => {
        console.log('Created!', id);
        return history.push('/scorecards');
      })
      .catch(err => console.log('Error creating scorecard!', err));
  }

  renderCheckboxes() {
    const { tasks } = this.state;
    const grouped = groupBy(tasks, 'category');
    const categories = keys(grouped);

    return categories.map((category, index) => {
      const subtasks = grouped[category];
      const score = this.calculateScore(subtasks);

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
          New Scorecard
        </h1>

        <DatePicker
          selected={date}
          onChange={this.handleDateChange.bind(this)} />

        <div className="component-container">
          {this.renderCheckboxes()}
        </div>

        <button
          className="button-default"
          onClick={this.submit.bind(this)}>
          Submit
        </button>

        <h2>
          Total Score: {this.calculateScore(tasks)}
        </h2>
      </div>
    );
  }
}

export default NewScoreCard;
