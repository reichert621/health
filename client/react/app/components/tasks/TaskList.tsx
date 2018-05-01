import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { all, resolve } from 'bluebird';
import { groupBy, extend } from 'lodash';
import {
  Task,
  Category,
  NewTask,
  fetchTasks,
  fetchCategories,
  fetchDefaultTasks,
  createTask,
  updateTask,
  createSuggestedTask,
  createCategory
} from '../../helpers/tasks';
import {
  IChallenge,
  fetchActiveChallenges,
  toggleChallengeSubscription
} from '../../helpers/challenges';
import NavBar from '../navbar';
import CategoryTasks from './CategoryTasks';
import ChallengeList from './ChallengeList';
import SuggestionsList from './SuggestionsList';
import './Task.less';

interface TaskListState {
  tasks: Task[];
  categories: Category[];
  challenges: IChallenge[];
  suggestions: NewTask[];
  newCategory: string;
  isAddingNew: boolean;
}

class TaskList extends React.Component<RouteComponentProps<{}>, TaskListState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      tasks: [],
      categories: [],
      challenges: [],
      suggestions: [],
      newCategory: '',
      isAddingNew: false
    };
  }

  componentDidMount() {
    // TODO: use redux instead
    return all([
      this.refreshTasks(),
      this.refreshChallenges()
    ]);
  }

  refreshTasks() {
    return all([
      fetchTasks(),
      fetchCategories(),
      fetchDefaultTasks() // TODO: only fetch if no tasks exist?
    ])
      .then(([tasks, categories, suggestions]) => {
        this.setState({ tasks, categories, suggestions });
      })
      .catch(err => {
        console.log('Error refreshing tasks!', err);
      });
  }

  refreshChallenges() {
    return fetchActiveChallenges()
      .then(challenges => this.setState({ challenges }))
      .catch(err => console.log('Error refreshing challenges!'));
  }

  handleCreateCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { newCategory, categories } = this.state;

    if (!newCategory) return resolve();

    const params = { name: newCategory, isActive: true };

    return createCategory(params)
      .then(category => {
        this.setState({
          categories: categories.concat(category),
          newCategory: ''
        });
      })
      .catch(err => {
        console.log('Error creating category!', err);
      });
  }

  handleCreateTask(categoryId: number, description: string, points: number) {
    const { tasks = [] } = this.state;
    const params = { categoryId, description, points };

    return createTask(params)
      .then(task => {
        this.setState({
          tasks: tasks.concat(task),
        });

        return task;
      });
  }

  handleUpdateTask(taskId: number, updates: object) {
    const { tasks = [] } = this.state;

    return updateTask(taskId, updates)
      .then(task => {
        this.setState({
          tasks: tasks.map(t => {
            return t.id === task.id ? extend(t, task) : t;
          })
        });

        return task;
      });
  }

  handleChallengeToggled(challenge: IChallenge) {
    const { id, isSubscribed } = challenge;
    const shouldSubscribe = !isSubscribed;

    return toggleChallengeSubscription(id, shouldSubscribe)
      .then(success => fetchActiveChallenges())
      .then(challenges => this.setState({ challenges }))
      .catch(err => {
        console.log('Error toggling challenge!', err);
      });
  }

  handleSuggestionAdded(task: NewTask) {
    return createSuggestedTask(task)
      .then(task => {
        // TODO: is there a better way to handle this?
        return this.refreshTasks();
      })
      .catch(err => {
        console.log('Error creating suggested task!', err);
      });
  }

  render() {
    const {
      tasks = [],
      categories = [],
      challenges = [],
      suggestions = [],
      newCategory,
      isAddingNew
    } = this.state;
    const { history } = this.props;
    const tasksByCategory = groupBy(tasks, 'category');
    const filteredSuggestions = suggestions.filter(suggestion => {
      const exists = tasks.some(task => {
        return (task.description === suggestion.description) &&
          (task.category === suggestion.category);
      });

      return !exists;
    });

    return (
      <div>
        <NavBar
          title='My Tasks'
          linkTo='/today'
          history={history} />

        <div className='default-container'>
          <ChallengeList
            challenges={challenges}
            onToggleChallenge={this.handleChallengeToggled.bind(this)} />

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
                    tasks={categoryTasks}
                    onCreateTask={this.handleCreateTask.bind(this)}
                    onUpdateTask={this.handleUpdateTask.bind(this)} />
                );
              })
          }

          <SuggestionsList
            suggestions={filteredSuggestions}
            isVisible={tasks.length < 10}
            onAddSuggestion={this.handleSuggestionAdded.bind(this)} />

          <div className='new-category-form'>
            {
              isAddingNew ?
                <form onSubmit={(e) => this.handleCreateCategory(e)}>
                  <input
                    type='text'
                    className='input-default -inline new-category-input'
                    placeholder='e.g. "Learn French", "Practice Guitar"'
                    value={newCategory}
                    onChange={(e) => this.setState({ newCategory: e.target.value })} />
                  <button
                    type='submit'
                    className='btn-primary'
                    disabled={!newCategory}>
                    Create
                  </button>
                  <a className='btn-link'
                    onClick={() => this.setState({ isAddingNew: false })}>
                    Cancel
                  </a>
                </form> :
                <button
                  className='btn-primary'
                  onClick={() => this.setState({ isAddingNew: true })}>
                    Add New Category
                </button>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default TaskList;
