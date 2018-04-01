import * as React from 'react';
import { keys } from 'lodash';

interface ScoreProps {
  categoryStats: any;
}

const ScoresByCategory = ({ categoryStats }: ScoreProps) => {
  return (
    <div>
      {
        keys(categoryStats).map((category, key) => {
          const { count, score } = categoryStats[category];
          return (
            <div key={key} style={{ marginBottom: 8 }}>
              <span className='text-active'>{category}</span>
              <span> - {count} completed / {score} points</span>
            </div>
          );
        })
      }
    </div>
  );
};

export default ScoresByCategory;
