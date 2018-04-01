import * as React from 'react';
import { keys } from 'lodash';
import { AbilityStats } from '../../helpers/reporting';

interface ScoreProps {
  abilityStats: AbilityStats;
}

// TODO: try rendering as a pie chart or something interesting like that?
const ScoresByAbility = ({ abilityStats }: ScoreProps) => {
  // TODO: determine ability "levels" based on total possible points per day.
  // For example, if the max points per day for "Health" is 24 but the max for
  // "Mindfulness" is 8, it should take longer to level up for "Health" since
  // it's ostensibly easier to get "Health" points than "Mindfulness" points.
  const stats = keys(abilityStats).map(ability => {
    const { count, score } = abilityStats[ability];

    return { ability, count, score };
  });

  return (
    <div>
      {
        stats
          .sort((x, y) => y.score - x.score)
          .slice(0, 5)
          .map(({ ability, count, score }, key) => {
            return (
              <div key={key}>
                <div className='text-active'>{ability}</div>
                <div className='reporting-label'>
                  {score} points / {count} completed
                </div>
              </div>
            );
          })
      }
    </div>
  );
};

export default ScoresByAbility;
