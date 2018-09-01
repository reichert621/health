import * as React from 'react';
import { Task } from '../../helpers/tasks';
import './Activity.less';

interface Props {
  task: Task;
}

const ActivityCardSimple = ({ task }: Props) => {
  const { description, points, category, isFavorite } = task;

  return (
    <div className={`activity-card-container simple ${isFavorite ? 'checked' : ''}`}>
      <div className='activity-description-container simple'>
        <div className={`activity-checkbox simple ${isFavorite ? 'checked' : ''}`}>
        </div>
        <div className='activity-description'>{description}</div>
      </div>
    </div>
  );
};

export default ActivityCardSimple;
