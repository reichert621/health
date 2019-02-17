import * as React from 'react';
import { keys } from 'lodash';
import { CorrelationStats } from '../../helpers/reporting';
import colors from '../../helpers/colors';

const CorrelationsTable = ({ stats }: { stats: CorrelationStats }) => {
  const { coefficients } = stats;
  // TODO: use styled components!
  const style = {
    container: { flex: 1, paddingTop: 16, paddingBottom: 16 },
    header: { marginTop: 0, fontSize: 18, paddingBottom: 4, marginBottom: 16 },
    label: { marginBottom: 4 },
    details: { marginBottom: 12 },
    score: { fontSize: 18, marginRight: 12, letterSpacing: 0.8 },
    description: { fontSize: 12 }
  };

  const formatLabel = (label: string) => {
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
    const direction =
      score < 0 ? (
        <span style={{ color: colors.RED }}>negative</span>
      ) : (
        <span style={{ color: colors.BLUE }}>positive</span>
      );

    if (n < 0.1) {
      return <span>no correlation</span>;
    } else if (n >= 0.1 && n < 0.3) {
      return <span>low {direction} correlation</span>;
    } else if (n >= 0.3 && n < 0.5) {
      return <span>moderate {direction} correlation</span>;
    } else {
      return <span>strong {direction} correlation</span>;
    }
  };

  return (
    <div className="analytics-section-container" style={style.container}>
      <h4 className="text-heavy" style={style.header}>
        Correlation Scores
      </h4>

      {keys(coefficients)
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
              <div
                className="activity-details-label text-med"
                style={style.label}
              >
                {label1} <span className="text-heavy">:</span> {label2}
              </div>

              <div style={style.details}>
                <span className="text-heavy" style={style.score}>
                  {formatScore(score)}
                </span>
                <span style={style.description}>
                  {getCorrelationLevel(score)}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CorrelationsTable;
