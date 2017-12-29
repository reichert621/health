import React from 'react';

const TaskCheckbox = ({ task, onToggle }) => {
  const { id, description, points, isComplete = false } = task;

  return (
    <div className="checkbox-container">
      <input
        type="checkbox"
        id={`task-${id}`}
        value={description}
        checked={isComplete}
        onChange={onToggle} />
      <label htmlFor={`task-${id}`}>{description}</label>
      <span className="score-details">({points} points)</span>
    </div>
  );
};

export default TaskCheckbox;
