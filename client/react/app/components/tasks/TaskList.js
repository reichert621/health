import React from 'react';
import { all, resolve } from 'bluebird';
import { groupBy } from 'lodash';
import {
  fetchTasks,
  fetchCategories,
  createTask,
  createCategory
} from '../../helpers/tasks';
import NavBar from '../navbar';
import './Task.less';

class CategoryTasks extends React.Component {
  constructor(props) {
    super(props);

    const { category, tasks } = props;

    this.state = {
      category,
      tasks,
      isCreating: false,
      newTask: '',
      newPoints: undefined
    };
  }

  handleCreateTask(e, category) {
    e.preventDefault();
    const { newTask, newPoints, tasks = [] } = this.state;

    if (!newTask || !newPoints) return resolve();

    const { id: categoryId } = category;
    const params = {
      categoryId,
      description: newTask,
      points: newPoints
    };

    return createTask(params)
      .then(task => {
        console.log('Created task!', task);
        return this.setState({
          tasks: tasks.concat(task),
          newTask: '',
          newPoints: 0
        });
      })
      .catch(err => {
        console.log('Error creating task!', err);
      });
  }

  render() {
    const {
      isCreating,
      category = {},
      tasks = [],
      newTask = '',
      newPoints = 0
    } = this.state;

    return (
      <div>
        <h4 className="category-label">
          {category.name}
          <img
            className={isCreating ? 'hidden' : 'plus-icon'}
            src="assets/plus.svg"
            onClick={() => this.setState({ isCreating: true })} />
        </h4>
        <ul className="task-sublist">
          {
            tasks.map((task, key) => {
              return (
                <li key={key}
                  className="task-item">
                  <span className="task-description">{task.description}</span>
                  <span className="task-points">{task.points} points</span>
                  <img className="edit-icon" src="assets/pencil.svg" />
                </li>
              );
            })
          }
        </ul>
        <form
          className={isCreating ? '' : 'hidden'}
          onSubmit={(e) => this.handleCreateTask(e, category)}>
          <input
            type="text"
            className="input-default -inline task-description-input"
            placeholder="New task"
            value={newTask}
            onChange={(e) => this.setState({ newTask: e.target.value })} />
          {/* TODO: fix width and only allow 1, 2, 4, 8, 16 points */}
          <input
            type="number"
            className="input-default -inline task-points-input"
            placeholder="0"
            min="0"
            value={newPoints}
            onChange={(e) => this.setState({ newPoints: e.target.value })} />
          <button
            type="submit"
            className="btn-primary"
            disabled={!newTask || !newPoints}>
            Create
          </button>
          <a className="btn-link"
            onClick={() => this.setState({ isCreating: false })}>
            Cancel
          </a>
        </form>
      </div>
    );
  }
}

class TaskList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      categories: [],
      newCategory: ''
    };
  }

  componentDidMount() {
    return all([
      fetchTasks(),
      fetchCategories()
    ])
      .then(([tasks, categories]) => this.setState({ tasks, categories }))
      .catch(err => {
        console.log('Error fetching tasks!', err);
      });
  }

  handleCreateCategory(e) {
    e.preventDefault();
    const { newCategory, categories } = this.state;

    if (!newCategory) return resolve();

    const params = { name: newCategory, isActive: true };

    return createCategory(params)
      .then(category => {
        console.log('Created category!', category);
        this.setState({
          categories: categories.concat(category),
          newCategory: ''
        });
      })
      .catch(err => {
        console.log('Error creating category!', err);
      });
  }

  render() {
    const { tasks, categories, newCategory } = this.state;
    const { history } = this.props;
    const tasksByCategory = groupBy(tasks, 'category');

    return (
      <div>
        <NavBar
          title="My Tasks"
          linkTo="/dashboard"
          history={history} />

        <div className="default-container">
          {
            categories.map((category, key) => {
              const { name } = category;
              const categoryTasks = tasksByCategory[name];

              return (
                <CategoryTasks
                  key={key}
                  category={category}
                  tasks={categoryTasks} />
              );
            })
          }

          <form
            className="new-category-form"
            onSubmit={(e) => this.handleCreateCategory(e)}>
            <input
              type="text"
              className="input-default -inline new-category-input"
              placeholder="New category"
              value={newCategory}
              onChange={(e) => this.setState({ newCategory: e.target.value })} />
            <button
              type="submit"
              className="btn-primary"
              disabled={!newCategory}>
              Create
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default TaskList;
