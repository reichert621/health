import React from 'react';

const TaskCheckbox = ({ task, onToggle }) => {
  const { id, description, points, isComplete = false } = task;

  return (
    <label className="checkbox-container unselectable clearfix">
      <input
        type="checkbox"
        id={`task-${id}`}
        value={description}
        checked={isComplete}
        onChange={onToggle} />
      <div className={`checkbox-indicator ${isComplete ? 'on' : 'off'}`} />
      <span
        className={`checkbox-label pull-left ${isComplete ? 'on' : 'off'}`}
        htmlFor={`task-${id}`}>
        {description}
      </span>
      <span
        className={`checkbox-label pull-right ${isComplete ? 'on' : 'off'}`}>
        {points} points
      </span>
    </label>
  );
};

export default TaskCheckbox;
