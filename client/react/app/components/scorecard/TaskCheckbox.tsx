import * as React from 'react';
import { Task } from '../../helpers/tasks';

interface CheckboxProps {
  task: Task;
  onToggle: () => void;
}

// Maps colors to point values (from light to dark)
const colors: { [n: string]: string } = {
  1: '#B8DBE9',
  2: '#8BC9E1',
  4: '#72BFDB',
  8: '#4FAED1',
  16: '#33A2CC'
};

const TaskCheckbox = ({ task, onToggle }: CheckboxProps) => {
  const {
    id,
    description,
    points,
    isComplete = false,
    isFavorite = false
  } = task;
  const color = colors[points];
  const style = {
    backgroundColor: color,
    borderColor: color
  };

  return (
    <label className='checkbox-container task-checkbox-container unselectable clearfix'>
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
      {/* TODO: experiment with other ways to represent "points" or "weight" */}
      {/*
      <span
        className='points-indicator pull-right'
        style={style}>
      </span>
      */}
      <span className={`checkbox-label task-points-label pull-right ${
        isComplete ? 'on' : 'off'
      }`}>
        {points} {points === 1 ? 'point' : 'points'}
      </span>
    </label>
  );
};

export default TaskCheckbox;
