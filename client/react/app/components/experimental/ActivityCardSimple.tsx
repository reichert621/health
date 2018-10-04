import * as React from 'react';
import { Task } from '../../helpers/tasks';
import './Activity.less';

interface Props {
  task: Task;
  onToggle: () => void;
  onView: () => void;
}

const ActivityCardSimple = ({ task, onToggle, onView }: Props) => {
  const { description, isComplete } = task;

  return (
    <div className={`activity-card-container simple ${isComplete ? 'checked' : ''}`}>
      <div className='activity-description-container simple'>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            className={`activity-checkbox simple ${isComplete ? 'checked' : ''}`}
            onClick={onToggle}>
          </div>
          <div className='activity-description'>{description}</div>
        </div>

        <div className='activity-expand' onClick={onView}>View</div>
      </div>
    </div>
  );
};

export default ActivityCardSimple;
