import * as React from 'react';
import { keys } from 'lodash';
import { CorrelationStats } from '../../helpers/reporting';

const formatLabel = (label: string): string => {
  const mappings: { [key: string]: string } = {
    depression: 'Depression',
    anxiety: 'Anxiety',
    wellbeing: 'Well-being',
    productivity: 'Productivity'
  };

  return mappings[label];
};

const formatScore = (score: number) => {
  const prefix = score < 0 ? '' : '+';

  return `${prefix}${score.toFixed(2)}`;
};

const getCorrelationLevel = (score: number) => {
  const n = Math.abs(score);
  const direction = score < 0 ? 'negative' : 'positive';

  if (n < 0.1) {
    return 'no correlation';
  } else if (n >= 0.1 && n < 0.3) {
    return `low ${direction} correlation`;
  } else if (n >= 0.3 && n < 0.5) {
    return `moderate ${direction} correlation`;
  } else {
    return `strong ${direction} correlation`;
  }
};

interface CorrelationProps {
  stats: CorrelationStats;
}

const CorrelationCoefficients = ({ stats }: CorrelationProps) => {
  const { coefficients } = stats;
  const style = {
    score: { fontSize: 16, marginRight: 8 },
    description: { fontSize: 14 },
    label: { marginTop: 2, marginBottom: 12 }
  };

  return (
    <div>
      {
        keys(coefficients)
          .sort((x, y) => {
            const scoreX = coefficients[x];
            const scoreY = coefficients[y];

            return Math.abs(scoreY) - Math.abs(scoreX);
          })
          .map((pair, key) => {
            const score = coefficients[pair];
            const [label1, label2] = pair.split(':').map(formatLabel);

            return (
              <div key={key}>
                <div className=''>
                  <span className='text-active' style={style.score}>
                    {formatScore(score)}
                  </span>
                  <span className='text-blue' style={style.description}>
                    {getCorrelationLevel(score)}
                  </span>
                </div>
                <div className='reporting-label' style={style.label}>
                  {label1} : {label2}
                </div>
              </div>
            );
          })
      }
    </div>
  );
};

export default CorrelationCoefficients;
