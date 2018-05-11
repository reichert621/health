import * as React from 'react';
import { resolve } from 'bluebird';
import { extend } from 'lodash';
import {
  Task,
  Category,
  PointOption,
  createTask,
  updateTask,
  getPointOptions
} from '../../helpers/tasks';
import TaskItem from './TaskItem';
import Dropdown from './Dropdown';

interface CategoryProps {
  category: Category;
  tasks: Task[];
  onCreateTask: (categoryId: number, description: string, points: number) => Promise<Task>;
  onUpdateTask: (taskId: number, updates: object) => Promise<Task>;
}

interface CategoryState {
  isCreating: boolean;
  newTask: string;
  newPoints?: number;
  selectedPointOption?: PointOption;
}

class CategoryTasks extends React.Component<CategoryProps, CategoryState> {
  constructor(props: CategoryProps) {
    super(props);

    this.state = {
      isCreating: false,
      newTask: '',
      newPoints: undefined
    };
  }

  componentDidUpdate(prevProps: CategoryProps, prevState: CategoryState) {
    const { isCreating } = this.state;
    const { isCreating: wasCreating } = prevState;

    if (!wasCreating && isCreating) {
      const el = (this.refs.newTaskInput as HTMLInputElement);

      el.focus();
    }
  }

  handleCreateTask(e: React.FormEvent<HTMLFormElement>, categoryId: number) {
    e.preventDefault();
    const { newTask, selectedPointOption } = this.state;
    const { onCreateTask } = this.props;
    const { points: newPoints } = selectedPointOption;

    if (!newTask || !newPoints || !categoryId) {
      return resolve();
    }

    return onCreateTask(categoryId, newTask, newPoints)
      .then(task => {
        return this.setState({
          newTask: '',
          newPoints: 0,
          isCreating: false
        });
      })
      .catch(err => {
        console.log('Error creating task!', err);
      });
  }

  handleUpdateTask(taskId: number, updates: object) {
    const { onUpdateTask } = this.props;

    return onUpdateTask(taskId, updates)
      .catch(err => {
        console.log('Error updating task!', err);
      });
  }

  handleToggleTaskActive(task: Task) {
    const { id, isActive } = task;
    const updates = { isActive: !isActive };

    return this.handleUpdateTask(id, updates);
  }

  handleToggleTaskFavorite(task: Task) {
    const { id, isFavorite } = task;
    const updates = { isFavorite: !isFavorite };

    return this.handleUpdateTask(id, updates);
  }

  cancelNewTask() {
    return this.setState({
      isCreating: false,
      newTask: '',
      selectedPointOption: null
    });
  }

  renderNewTaskForm() {
    const options = getPointOptions();
    const { category = {} as Category } = this.props;
    const { id: categoryId } = category;
    const {
      isCreating,
      newTask = '',
      newPoints = 0,
      selectedPointOption
    } = this.state;

    return (
      <form
        className={isCreating ? '' : 'hidden'}
        onSubmit={(e) => this.handleCreateTask(e, categoryId)}>
        <input
          type='text'
          className='input-default -inline task-description-input'
          ref='newTaskInput'
          placeholder='New task'
          value={newTask}
          onChange={(e) => this.setState({ newTask: e.target.value })} />
        <Dropdown
          className='task-points-input -inline'
          options={options}
          selected={selectedPointOption}
          onSelect={option => this.setState({ selectedPointOption: option })} />
        <button
          type='submit'
          className='btn-primary'
          disabled={!newTask || !selectedPointOption}>
          Create
        </button>
        <a className='btn-link'
          onClick={() => this.cancelNewTask()}>
          Cancel
        </a>
      </form>
    );
  }

  render() {
    const { category = {} as Category, tasks = [] } = this.props;
    const { isCreating } = this.state;
    const { name: categoryName } = category;
    const isActive = tasks.some(t => t.isActive);

    return (
      <div>
        <h4 className={`category-label ${isActive ? 'active' : 'inactive'}`}>
          {categoryName}
          <img
            className={isCreating ? 'hidden' : 'plus-icon'}
            src='assets/plus.svg'
            onClick={() => this.setState({ isCreating: true })} />
        </h4>
        <ul className='task-sublist'>
          {
            tasks
              .map((task, index) => {
                const { id: taskId } = task;
                const key = taskId || index;

                return (
                  <TaskItem
                    key={key}
                    task={task}
                    onUpdateTask={this.handleUpdateTask.bind(this)}
                    onToggleTaskActive={this.handleToggleTaskActive.bind(this)}
                    onToggleTaskFavorite={this.handleToggleTaskFavorite.bind(this)} />
                );
              })
          }
          <li className='task-item-container'>
            {this.renderNewTaskForm()}
          </li>
        </ul>
      </div>
    );
  }
}

export default CategoryTasks;
