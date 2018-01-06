import React from 'react';
import { all } from 'bluebird';
import { groupBy } from 'lodash';
import {
  fetchTasks,
  fetchCategories,
  createTask,
  createCategory
} from '../../helpers/tasks';
import NavBar from '../navbar';

class CategoryTasks extends React.Component {
  constructor(props) {
    super(props);

    const { category, tasks } = props;

    this.state = {
      category,
      tasks,
      newTask: '',
      newPoints: 0
    };
  }

  handleCreateTask(e, category) {
    e.preventDefault();
    const { newTask, newPoints, tasks = [] } = this.state;
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
      category = {},
      tasks = [],
      newTask = '',
      newPoints = 0
    } = this.state;

    return (
      <div>
        <h3>{category.name}</h3>
        <ul>
          {
            tasks.map((task, key) => {
              return (
                <li key={key}>
                  <span>{task.description}</span>
                  <span> ({task.points} points)</span>
                </li>
              );
            })
          }
        </ul>
        <form onSubmit={(e) => this.handleCreateTask(e, category)}>
          <input
            type="text"
            className="input-default -inline"
            placeholder="Enter New task"
            style={{ marginLeft: 24 }}
            value={newTask}
            onChange={(e) => this.setState({ newTask: e.target.value })} />
          {/* TODO: fix width and only allow 1, 2, 4, 8, 16 points */}
          <input
            type="number"
            className="input-default -inline"
            placeholder="0"
            min="0"
            value={newPoints}
            style={{ width: 80 }}
            onChange={(e) => this.setState({ newPoints: e.target.value })} />
          <button
            type="submit"
            className="button-default">
            Create
          </button>
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

          <hr />

          <form
            style={{ marginTop: 16 }}
            onSubmit={(e) => this.handleCreateCategory(e)}>
            <input
              type="text"
              className="input-default -inline"
              placeholder="Enter new category"
              value={newCategory}
              onChange={(e) => this.setState({ newCategory: e.target.value })} />
            <button
              type="submit"
              className="button-default">
              Create
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default TaskList;
