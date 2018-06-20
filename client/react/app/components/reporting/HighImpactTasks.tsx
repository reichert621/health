import * as React from 'react';
import { TaskImpactStats } from '../../helpers/reporting';

interface TaskImpact {
  tasks: TaskImpactStats[];
  label: string;
}

const HighImpactTasks = ({ label, tasks = [] }: TaskImpact) => {
  return (
    <div>
      {
        tasks
          .slice(0, 5)
          .map(({ task, data }, key) => {
            const { average, scores } = data;
            const count = scores.length;

            return (
              <div key={key}>
                <div className='text-active'>{task}</div>
                <div className='reporting-label'>
                  Average {average.toFixed(1)}% {label} / Count: {count}
                </div>
              </div>
            );
          })
      }
    </div>
  );
};

export default HighImpactTasks;
