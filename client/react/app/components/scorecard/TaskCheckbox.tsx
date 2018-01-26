import * as React from 'react';
import { Task } from '../../helpers/tasks';

interface CheckboxProps {
  task: Task;
  onToggle: () => void;
}

const TaskCheckbox = ({ task, onToggle }: CheckboxProps) => {
  const { id, description, points, isComplete = false } = task;

  return (
    <label className='checkbox-container unselectable clearfix'>
      <input
        type='checkbox'
        id={`task-${id}`}
        value={description}
        checked={isComplete}
        onChange={onToggle} />
      <div className={`checkbox-indicator ${isComplete ? 'on' : 'off'}`} />
      <span
        className={`checkbox-label pull-left ${isComplete ? 'on' : 'off'}`}>
        {description}
      </span>
      <span
        className={`checkbox-label pull-right ${isComplete ? 'on' : 'off'}`}>
        {points} {points === 1 ? 'point' : 'points'}
      </span>
    </label>
  );
};

export default TaskCheckbox;
