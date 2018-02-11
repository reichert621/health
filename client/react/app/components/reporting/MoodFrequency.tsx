import * as React from 'react';
import { keys } from 'lodash';
import { getFormattedPercentage } from '../../helpers/utils';

interface MoodItemProps {
  level: string;
  count: number;
  total: number;
}

// TODO: DRY this up (see TopTasks)
const MoodItem = ({ level, count, total }: MoodItemProps) => {
  return (
    <li className='reporting-percentage-item'>
      <div className='percentage-bar-container'>
        <div className='percentage-bar'
          style={{
            width: `${getFormattedPercentage(count, total)}%`
          }}>
        </div>
      </div>

      <div>
        <span className='text-active'>
          {getFormattedPercentage(count, total)}%
        </span>
        <span> / {level} - {count}</span>
      </div>
    </li>
  );
};

interface MoodFrequencyProps {
  stats: {
    [level: string]: number;
  };
}

const MoodFrequency = ({ stats = {} }: MoodFrequencyProps) => {
  const frequencies = keys(stats).map(level => {
    const count = stats[level];

    return { level, count };
  });
  const total = frequencies.reduce((sum, f) => sum + f.count, 0);

  return (
    <div>
      <ul className='reporting-percentages-container'>
        {
          frequencies.map(({ level, count }, key) => {
            return (
              <MoodItem
                key={key}
                level={level}
                count={count}
                total={total} />
            );
          })
        }
      </ul>
    </div>
  );
};

export default MoodFrequency;
