import * as React from 'react';
import { TaskImpactStats } from '../../helpers/reporting';

const HighImpactTasks = ({ tasks = [] }: { tasks: TaskImpactStats[] }) => {
  return (
    <div>
      {
        tasks
          .slice(0, 5)
          .map(({ task, data }, key) => {
            const { average, scores } = data;
            const happiness = 100 - average;
            const count = scores.length;

            return (
              <div key={key}>
                <div className='text-active'>{task}</div>
                <div className='reporting-label'>
                  Average {happiness.toFixed(1)}% happy / Count: {count}
                </div>
              </div>
            );
          })
      }
    </div>
  );
};

export default HighImpactTasks;
