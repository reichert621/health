import React from 'react';
import { all, resolve } from 'bluebird';
import { groupBy } from 'lodash';
import {
  fetchTasks,
  fetchCategories,
  createCategory
} from '../../helpers/tasks';
import NavBar from '../navbar';
import CategoryTasks from './CategoryTasks';
import './Task.less';

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
            categories
              .sort((x, y) => x.id - y.id)
              .map((category, key) => {
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
