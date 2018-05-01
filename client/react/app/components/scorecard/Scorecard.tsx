import * as React from 'react';
import { Link } from 'react-router-dom';
import { groupBy, keys, sortBy } from 'lodash';
import TaskCheckbox from './TaskCheckbox';
import ChallengeCheckbox from './ChallengeCheckbox';
import { Task, calculateScore } from '../../helpers/tasks';
import { IScorecard } from '../../helpers/scorecard';
import { IChallenge } from '../../helpers/challenges';
import './Scorecard.less';

interface ScorecardProps {
  tasks: Task[];
  challenges?: IChallenge[];
  isLoading?: boolean;
  handleTaskUpdate: (task: Task) => Promise<any>;
  handleChallengeUpdate?: (challenge: IChallenge) => Promise<any>;
}

const Scorecard = ({
  tasks = [],
  challenges = [],
  handleTaskUpdate,
  handleChallengeUpdate,
  isLoading
}: ScorecardProps) => {
  if (isLoading) return null;

  if (!tasks.length && !challenges.length) {
    return (
      <div>
        <h2>No tasks :(</h2>
        <div>
          <Link to='/tasks'>Click here</Link> to get started!
        </div>
      </div>
    );
  }

  const grouped = groupBy(tasks, 'category');
  const categories = keys(grouped);

  return (
    <div className='scorecard-component'>
      <h4 className={`category-label ${
        challenges && challenges.length ? '' : 'hidden'
      }`}>
        <span>Challenges</span>
      </h4>
      {
        challenges.map((challenge, key) => {
          return (
            <ChallengeCheckbox
              key={key}
              challenge={challenge}
              onToggle={() => handleChallengeUpdate(challenge)} />
          );
        })
      }
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
