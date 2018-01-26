import React from 'react';
import { Link } from 'react-router-dom';
import { groupBy, keys } from 'lodash';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TaskCheckbox from './TaskCheckbox';
import ScorecardOverview from './ScorecardOverview';
import { fetchTasks, calculateScore } from '../../helpers/tasks';
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
        return history.push('/dashboard');
      })
      .catch(err => console.log('Error creating scorecard!', err));
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
          <h4 className="category-label">
            <span>{category}</span>
            <span className="score-details hidden">(score: {score})</span>
          </h4>
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
    const completed = tasks.filter(t => t.isComplete);

    return (
      <div className="default-container">
        <Link to="/scorecards">Back</Link>

        <h1>
          Scorecard
        </h1>

        <DatePicker
          selected={date}
          onChange={this.handleDateChange.bind(this)} />

        <h3 className="text-light">
          {date.format('dddd MMMM DD, YYYY')}
        </h3>

        <div className="clearfix">
          <div className="scorecard-container pull-left">
            {this.renderCheckboxes()}
          </div>

          <div className="scorecard-overview-container pull-right">
            <ScorecardOverview tasks={completed} />
          </div>
        </div>

        <button
          className="btn-default"
          onClick={this.submit.bind(this)}>
          Submit
        </button>
      </div>
    );
  }
}

export default NewScoreCard;
