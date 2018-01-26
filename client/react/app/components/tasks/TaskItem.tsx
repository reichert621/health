import * as React from 'react';
import { resolve } from 'bluebird';
import { extend } from 'lodash';
import { Task } from '../../helpers/tasks';

interface TaskItemProps {
  task: Task;
  onUpdateTask: (id: number, updates: object) => Promise<Task>;
  onToggleTaskActive: (task: Task) => void;
}

interface TaskItemState {
  updatedTask: Task;
  isEditing: boolean;
}

class TaskItem extends React.Component<TaskItemProps, TaskItemState> {
  constructor(props: TaskItemProps) {
    super(props);

    const { task } = props;

    this.state = {
      updatedTask: extend({}, task),
      isEditing: false
    };
  }

  updateTask(e: any) {
    const { name, value } = e.target;
    const { updatedTask } = this.state;

    return this.setState({
      updatedTask: extend(updatedTask, { [name]: value })
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
      isEditing: false
    });
  }

  renderStaticTask() {
    const { task, onToggleTaskActive } = this.props;
    const { description, points, isActive } = task;

    return (
      <div className={`task-item ${isActive ? 'active' : 'inactive'}`}>
        <span className='task-description'>{description}</span>
        <span className='task-points'>{points} points</span>
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
    const { updatedTask } = this.state;
    const { description, points } = updatedTask;

    return (
      <form onSubmit={this.saveUpdatedTask.bind(this)}>
        <input
          type='text'
          name='description'
          className='input-default -inline task-description-input'
          placeholder='Task'
          value={description}
          onChange={this.updateTask.bind(this)} />
        {/* TODO: fix width and only allow 1, 2, 4, 8, 16 points */}
        <input
          type='number'
          name='points'
          className='input-default -inline task-points-input'
          placeholder='0'
          min='0'
          value={points}
          onChange={this.updateTask.bind(this)} />
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
