import * as React from 'react';
import { groupBy, keys } from 'lodash';
import { calculateScore } from '../../helpers/tasks';
import { formatPoints } from '../../helpers/utils';

interface CategoryProps {
  category: string;
  subtasks: any[]; // TODO
}

const CategorySubtasks = ({ category, subtasks }: CategoryProps) => {
  return (
    <div>
      <div className='scorecard-overview-category-label'>
        {category}
      </div>
      {
        subtasks.map((task, key) => {
          const { description, points } = task;
          return (
            <div
              key={key}
              className='scorecard-overview-completed-task clearfix'>
              <span className='pull-left'>{description}</span>
              <span className='pull-right text-active'>
                {formatPoints(points)}
              </span>
            </div>
          );
        })
      }
    </div>
  );
};

interface OverviewProps {
  tasks: any[]; // TODO
}

const ScoreCardOverview = ({ tasks }: OverviewProps) => {
  const total = calculateScore(tasks);
  const grouped = groupBy(tasks, 'category');
  const categories = keys(grouped);

  return (
    <div className='scorecard-overview'>
      <div className='scorecard-overview-total-container'>
        <div className='text-active'>
          {total} productivity {total === 1 ? 'point' : 'points'}
        </div>
      </div>
      <div className='scorecard-overview-details-container'>
        {
          categories.map((category, key) => {
            const subtasks = grouped[category];

            return (
              <CategorySubtasks
                key={key}
                category={category}
                subtasks={subtasks} />
            );
          })
        }
      </div>
    </div>
  );
};

export default ScoreCardOverview;
