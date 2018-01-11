import React from 'react';

const getPercentage = (n, total) => {
  const decimal = n / total;
  const percentage = Math.floor(decimal * 100);

  return `${percentage}%`;
};

const TopTasks = ({ tasks = [] }) => {
  const total = tasks.reduce((result, t) => result + t.count, 0);

  return (
    <ul>
      {
        tasks.slice(0, 5).map((t, key) => {
          const { task, count } = t;
          return (
            <li key={key}>
              {task} - {count} ({getPercentage(count, total)})
            </li>
          );
        })
      }
    </ul>
  );
};

export default TopTasks;
