import React from 'react';
import { getFormattedPercentage } from '../../helpers/utils';

// TODO: DRY this up (see MoodFrequency)
const TopTaskItem = ({ task, count, total }) => {
  return (
    <li className="reporting-percentage-item">
      <div className="percentage-bar-container">
        <div className="percentage-bar"
          style={{
            width: `${getFormattedPercentage(count, total)}%`
          }}>
        </div>
      </div>

      <div>
        <span className="text-active">
          {getFormattedPercentage(count, total)}%
        </span>
        <span> / {task} - {count}</span>
      </div>
    </li>
  );
};

const TopTasks = ({ tasks = [] }) => {
  const total = tasks.reduce((result, t) => result + t.count, 0);
  const topTasks = tasks.slice(0, 6);

  return (
    <div>
      <ul className="reporting-percentages-container">
        {
          topTasks.map((t, key) => {
            const { task, count } = t;
            return (
              <TopTaskItem
                key={key}
                task={task}
                count={count}
                total={total} />
            );
          })
        }
      </ul>
    </div>
  );
};

export default TopTasks;
