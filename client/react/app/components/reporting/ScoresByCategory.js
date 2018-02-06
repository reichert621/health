import React from 'react';
import { keys } from 'lodash';

const ScoresByCategory = ({ categoryStats }) => {
  return (
    <div className="">
      {
        keys(categoryStats).map((category, key) => {
          const { count, score } = categoryStats[category];
          return (
            <div key={key} style={{ marginBottom: 8 }}>
              <span className="text-active">{category}</span>
              <span> - {count} completed / {score} points</span>
            </div>
          );
        })
      }
    </div>
  );
};

export default ScoresByCategory;
