import React from 'react';

const getPercentage = (n, total) => {
  const decimal = n / total;

  return decimal * 100;
};

const getFormattedPercentage = (n, total) => {
  const percentage = getPercentage(n, total);

  return percentage.toFixed(1);
};

const TopTaskItem = ({ task, count, total }) => {
  return (
    <li className="top-task-item">
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
  const points = tasks.reduce((result, t) => result + t.points, 0);

  return (
    <div>
      <div>
        Tasks completed to date: {total}
      </div>
      <div>
        Points scored to date: {points}
      </div>
      <ul className="reporting-component-container">
        {
          tasks.slice(0, 5).map((t, key) => {
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
