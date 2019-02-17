import * as React from 'react';
import { isNumber } from 'lodash';
import { TaskAssessmentStats, formatTaskStats } from '../../helpers/tasks';
import colors from '../../helpers/colors';

interface TaskReportingTableProps {
  stats: TaskAssessmentStats[];
}

// TODO: allow sorting by:
// - overall depression/anxiety/wellness/happiness
// - impact on depression/anxiety/wellness/happiness
// TODO: add client-side pagination
const TaskReportingTable = ({ stats }: TaskReportingTableProps) => {
  const POSITIVE = 1;
  const NEGATIVE = -1;
  const formatted = formatTaskStats(stats);
  const styles = {
    container: { paddingTop: 16, paddingBottom: 16 },
    table: { marginBottom: 0 },
    delta: { marginLeft: 4 },
    lg: { width: '25%' },
    sm: { width: '15%' }
  };

  const getDeltaSymbol = (n: number) => {
    return n > 0 ? '+' : '';
  };

  const renderDelta = (delta: number, direction: number = POSITIVE) => {
    if (isNumber(delta)) {
      const s = {
        color: delta * direction > 0 ? colors.BLUE : colors.RED
      };

      return (
        <span style={styles.delta}>
          (
          <span style={s}>
            {getDeltaSymbol(delta)}
            {delta.toFixed(1)}%
          </span>
          )
        </span>
      );
    } else {
      return <span />;
    }
  };

  return (
    <div className="analytics-section-container" style={styles.container}>
      <table className="analytics-table" style={styles.table}>
        <thead>
          <tr>
            <th className="text-left" style={styles.lg}>
              Task
            </th>
            <th style={styles.sm}>Count</th>
            <th style={styles.sm}>Depression</th>
            <th style={styles.sm}>Anxiety</th>
            <th style={styles.sm}>Wellness</th>
            <th style={styles.sm}>Happiness</th>
          </tr>
        </thead>
        <tbody>
          {formatted
            .sort((x, y) => {
              // return y.percentages.happiness - x.percentages.happiness;
              return y.deltas.happiness - x.deltas.happiness;
              // return y.deltas.wellness - x.deltas.wellness;
              // return x.deltas.anxiety - y.deltas.anxiety;
              // return x.deltas.depression - y.deltas.depression;
            })
            .slice(0, 10)
            .map((stat, key) => {
              const { name, count, percentages, deltas } = stat;
              const { depression, anxiety, wellness, happiness } = percentages;
              const {
                depression: dDelta,
                anxiety: aDelta,
                wellness: wDelta,
                happiness: hDelta
              } = deltas;

              return (
                <tr key={key} className="analytics-row">
                  <td className="text-left" style={styles.lg}>
                    {name}
                  </td>
                  <td style={styles.sm}>
                    {count} time{count === 1 ? '' : 's'}
                  </td>
                  <td style={styles.sm}>
                    {isNumber(depression) ? `${depression.toFixed(1)}%` : 'N/A'}{' '}
                    {renderDelta(dDelta, NEGATIVE)}
                  </td>
                  <td style={styles.sm}>
                    {isNumber(anxiety) ? `${anxiety.toFixed(1)}%` : 'N/A'}{' '}
                    {renderDelta(aDelta, NEGATIVE)}
                  </td>
                  <td style={styles.sm}>
                    {isNumber(wellness) ? `${wellness.toFixed(1)}%` : 'N/A'}{' '}
                    {renderDelta(wDelta, POSITIVE)}
                  </td>
                  <td style={styles.sm}>
                    {isNumber(happiness) ? `${happiness.toFixed(1)}%` : 'N/A'}{' '}
                    {renderDelta(hDelta, POSITIVE)}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskReportingTable;
