import * as React from 'react';
import { ChecklistQuestionStats } from '../../helpers/reporting';

const TopMoods = ({ stats = [] }: { stats: ChecklistQuestionStats[] }) => {
  console.log('Top mood stats!', stats);

  return (
    <div>
      {
        stats
          .slice(0, 5)
          .map(({ question, average }, key) => {
            const score = (average / 4) * 100;

            return (
              <div key={key}>
                <div className='text-active'>{question}</div>
                <div className='reporting-label'>
                  Average {score.toFixed(1)}%
                </div>
              </div>
            );
          })
      }
    </div>
  );
};

export default TopMoods;
