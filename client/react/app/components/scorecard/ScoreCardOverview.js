import React from 'react';
import { groupBy, keys } from 'lodash';
import { calculateScore } from '../../helpers/tasks';

const CategorySubtasks = ({ category, subtasks }) => {
  return (
    <div>
      <div className="scorecard-overview-category-label">
        {category}
      </div>
      {
        subtasks.map((task, key) => {
          return (
            <div
              key={key}
              className="scorecard-overview-completed-task clearfix">
              <span className="pull-left">{task.description}</span>
              <span className="pull-right text-active">
                {task.points} {task.points === 1 ? 'point' : 'points'}
              </span>
            </div>
          );
        })
      }
    </div>
  );
};

const ScoreCardOverview = ({ tasks }) => {
  const total = calculateScore(tasks);
  const grouped = groupBy(tasks, 'category');
  const categories = keys(grouped);

  return (
    <div className="scorecard-overview">
      <div className="scorecard-overview-total-container">
        <div className="text-active">
          {total} productivity {total === 1 ? 'point' : 'points'}
        </div>
      </div>
      <div className="scorecard-overview-details-container">
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
