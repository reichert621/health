import * as React from 'react';
import { resolve } from 'bluebird';
import { extend, find } from 'lodash';
import { PointOption, Task, getPointOptions } from '../../helpers/tasks';
import { formatPoints } from '../../helpers/utils';
import Dropdown from './Dropdown';

interface TaskItemProps {
  task: Task;
  onUpdateTask: (id: number, updates: object) => Promise<Task>;
  onToggleTaskActive: (task: Task) => void;
}

interface TaskItemState {
  updatedTask: Task;
  selected?: PointOption;
  isEditing: boolean;
}

class TaskItem extends React.Component<TaskItemProps, TaskItemState> {
  constructor(props: TaskItemProps) {
    super(props);

    const { task } = props;

    this.state = {
      updatedTask: extend({}, task),
      selected: this.getDefaultPointOption(),
      isEditing: false
    };
  }

  updateTaskDescription(description: string) {
    const { updatedTask } = this.state;

    return this.setState({
      updatedTask: extend(updatedTask, { description })
    });
  }

  updateTaskPoints(option: PointOption) {
    const { points } = option;
    const { updatedTask } = this.state;

    return this.setState({
      selected: option,
      updatedTask: extend(updatedTask, { points })
    });
  }

  saveUpdatedTask(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();

    const { updatedTask } = this.state;
    const { onUpdateTask } = this.props;
    const { id, description, points } = updatedTask;
    const updates = { description, points };

    if (!description || !points) return resolve();

    return onUpdateTask(id, updates)
      .then(() => {
        this.setState({ isEditing: false });
      });
  }

  handleCancel() {
    const { task } = this.props;

    return this.setState({
      updatedTask: extend({}, task),
      selected: this.getDefaultPointOption(),
      isEditing: false
    });
  }

  getDefaultPointOption(): PointOption {
    const { task } = this.props;

    return find(getPointOptions(), { points: task.points });
  }

  renderStaticTask() {
    const { task, onToggleTaskActive } = this.props;
    const { description, points, isActive } = task;

    return (
      <div className={`task-item editable ${isActive ? 'active' : 'inactive'}`}>
        <span className='task-description'
          onClick={() => this.setState({ isEditing: true })}>
          {description}
        </span>
        <span className='task-points'
          onClick={() => this.setState({ isEditing: true })}>
          {formatPoints(points)}
        </span>
        <img className='edit-icon'
          src='assets/pencil.svg'
          onClick={() => this.setState({ isEditing: true })} />

        <img className={`task-active-icon ${isActive ? 'active' : 'inactive'}`}
          src='assets/plus-gray.svg'
          onClick={() => onToggleTaskActive(task)} />
      </div>
    );
  }

  renderEditableTask() {
    const { updatedTask, selected } = this.state;
    const { description, points } = updatedTask;
    const options = getPointOptions();

    return (
      <form onSubmit={this.saveUpdatedTask.bind(this)}>
        <input
          type='text'
          name='description'
          className='input-default -inline task-description-input'
          placeholder='Task'
          value={description}
          onChange={e => this.updateTaskDescription(e.target.value)} />
        <Dropdown
          className='task-points-input -inline'
          options={options}
          selected={selected}
          onSelect={option => this.updateTaskPoints(option)} />
        <button
          type='submit'
          className='btn-primary'>
          Save
        </button>
        <a className='btn-link'
          onClick={this.handleCancel.bind(this)}>
          Cancel
        </a>
      </form>
    );
  }

  render() {
    const { isEditing } = this.state;

    return (
      <li className='task-item-container'>
        {
          isEditing ?
            this.renderEditableTask() :
            this.renderStaticTask()
        }
      </li>
    );
  }
}

export default TaskItem;
