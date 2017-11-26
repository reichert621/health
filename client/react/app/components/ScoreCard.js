import React from 'react';
import { groupBy, keys } from 'lodash';
import './ScoreCard.less';

/**
 * TODO:
 * - Consider how CRUD methods would work with models
 * - Should changes to global tasks/categories affect previous score cards?
 * - Should a user be able to delete tasks/categories or just archive them?
 * - Should new task records be created on every entry?
 *
 * Schema:
 * - Category:
 *   - { id, name, userId }
 * - Task:
 *   - { id, categoryId, description, points, userId }
 * - ScoreCard
 *   - { id, date, userId, title (optional, defaults to formatted date in UI) }
 * - SelectedTask
 *   - { id, scoreCardId, taskId }
 * OR:
 * - ScoreCardTask
 *   - { id, scoreCardId, category, description, points, isComplete }
 */
const getTestTasks = () => {
  return [
    // Read
    { id: 1, category: 'Read', description: '2+ hours', points: 8, isComplete: false },
    { id: 2, category: 'Read', description: '1 hour', points: 4, isComplete: false },
    { id: 3, category: 'Read', description: '40 mins', points: 2, isComplete: false },
    { id: 4, category: 'Read', description: '< 20 mins', points: 1, isComplete: false },
    // Write
    { id: 5, category: 'Write', description: 'Blog Entry', points: 8, isComplete: false },
    { id: 6, category: 'Write', description: 'Journaling', points: 4, isComplete: false },
    // Exercise
    { id: 7, category: 'Exercise', description: 'Gym workout', points: 8, isComplete: false },
    { id: 8, category: 'Exercise', description: 'Basketball', points: 8, isComplete: false },
    { id: 9, category: 'Exercise', description: 'Yoga', points: 4, isComplete: false },
    { id: 10, category: 'Exercise', description: 'Bike', points: 2, isComplete: false },
    { id: 11, category: 'Exercise', description: 'Walk', points: 1, isComplete: false },
    { id: 12, category: 'Exercise', description: 'Home workout', points: 1, isComplete: false },
    // Eat Healthy
    { id: 13, category: 'Eat Healthy', description: 'Salad', points: 4, isComplete: false },
    { id: 14, category: 'Eat Healthy', description: 'Veggie smoothie', points: 4, isComplete: false },
    { id: 15, category: 'Eat Healthy', description: 'Eggs', points: 4, isComplete: false },
    { id: 16, category: 'Eat Healthy', description: '8 glasses of water', points: 4, isComplete: false },
    { id: 17, category: 'Eat Healthy', description: 'Fruit smoothie', points: 2, isComplete: false },
    // Code
    { id: 18, category: 'Code', description: 'Side project', points: 8, isComplete: false },
    { id: 19, category: 'Code', description: 'Practice problems', points: 4, isComplete: false },
    // Music
    { id: 20, category: 'Music', description: 'Cello', points: 8, isComplete: false },
    { id: 21, category: 'Music', description: 'Guitar', points: 2, isComplete: false },
    { id: 22, category: 'Music', description: 'Piano', points: 1, isComplete: false },
    // Podcast
    { id: 23, category: 'Podcast', description: '2+ hours', points: 4, isComplete: false },
    { id: 24, category: 'Podcast', description: '1 hour', points: 2, isComplete: false },
    { id: 25, category: 'Podcast', description: '< 1 hour', points: 1, isComplete: false },
    // Socialize
    { id: 26, category: 'Socialize', description: 'Organize a dinner/party/event', points: 8, isComplete: false },
    { id: 27, category: 'Socialize', description: 'Get lunch/dinner with friends', points: 4, isComplete: false },
    { id: 28, category: 'Socialize', description: 'Message family to check in', points: 4, isComplete: false },
    { id: 29, category: 'Socialize', description: 'Message a friend to check in', points: 2, isComplete: false },
    // Meditate
    { id: 30, category: 'Meditate', description: '10+ minutes', points: 4, isComplete: false },
    { id: 31, category: 'Meditate', description: '1 - 10 minutes', points: 2, isComplete: false },
    { id: 32, category: 'Meditate', description: '< 1 minute', points: 1, isComplete: false }
  ];
};

const Checkbox = ({ task, handleCheckboxUpdate }) => {
  const { description, points, isComplete } = task;

  return (
    <div>
      <label>
        <input
          type="checkbox"
          value={description}
          checked={isComplete}
          onChange={handleCheckboxUpdate} />
        {description} ({points} points)
      </label>
    </div>
  );
};

class ScoreCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: getTestTasks()
    };
  }

  handleCheckboxUpdate(task) {
    const { options } = this.state;
    const update = options.map(option => {
      if (option.id === task.id) {
        return { ...option, isComplete: !option.isComplete };
      } else {
        return option;
      }
    });

    return this.setState({ options: update });
  }

  calculateScore(tasks) {
    return tasks.reduce((score, task) => {
      const { isComplete, points } = task;

      if (isComplete) {
        return score + points;
      } else {
        return score;
      }
    }, 0);
  }

  renderCheckboxes() {
    const { options } = this.state;
    const grouped = groupBy(options, 'category');
    const categories = keys(grouped);

    return categories.map((category, index) => {
      const tasks = grouped[category];
      const score = this.calculateScore(tasks);

      return (
        <div key={index}>
          <label>{category} (score: {score})</label>
          {
            tasks.map((task, key) => {
              return (
                <Checkbox
                  key={key}
                  task={task}
                  handleCheckboxUpdate={this.handleCheckboxUpdate.bind(this, task)} />
              );
            })
          }
        </div>
      );
    });
  }

  render() {
    const { options } = this.state;

    return (
      <div className="default-container">
        <h1>
          Daily Score Card
        </h1>

        <h2>Total Score: {this.calculateScore(options)}</h2>

        <div className="component-container">
          {this.renderCheckboxes()}
        </div>
      </div>
    );
  }
}

export default ScoreCard;
