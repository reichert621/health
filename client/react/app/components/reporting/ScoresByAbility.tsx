import * as React from 'react';
import { keys } from 'lodash';
import { AbilityStats } from '../../helpers/reporting';

interface ScoreProps {
  abilityStats: AbilityStats;
}

// TODO: try rendering as a pie chart or something interesting like that?
const ScoresByAbility = ({ abilityStats }: ScoreProps) => {
  return (
    <div>
      {
        keys(abilityStats).map((ability, key) => {
          const { count, score } = abilityStats[ability];
          return (
            <div key={key} style={{ marginBottom: 8 }}>
              <span className='text-active'>{ability}</span>
              <span> - {count} completed / {score} points</span>
            </div>
          );
        })
      }
    </div>
  );
};

export default ScoresByAbility;
