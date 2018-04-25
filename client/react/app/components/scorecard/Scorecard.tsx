import * as React from 'react';
import { groupBy, keys, sortBy } from 'lodash';
import TaskCheckbox from './TaskCheckbox';
import { Task, calculateScore } from '../../helpers/tasks';
import { IScorecard } from '../../helpers/scorecard';
import './Scorecard.less';

interface ScorecardProps {
  tasks: Task[];
  handleTaskUpdate: (task: Task) => Promise<any>;
}

const Scorecard = ({ tasks = [], handleTaskUpdate }: ScorecardProps) => {
  const grouped = groupBy(tasks, 'category');
  const categories = keys(grouped);

  return (
    <div className='scorecard-component'>
      {
        categories.map((category, index) => {
          const subtasks = sortBy(grouped[category], t => -t.points);
          const score = calculateScore(subtasks);

          return (
            <div key={index}>
              <h4 className='category-label'>
                <span>{category}</span>
                <span className='score-details hidden'>(score: {score})</span>
              </h4>
              {
                subtasks.map((task, key) => {
                  return (
                    <TaskCheckbox
                      key={key}
                      task={task}
                      onToggle={() => handleTaskUpdate(task)} />
                  );
                })
              }
            </div>
          );
        })
      }
    </div>
  );
};

export default Scorecard;
