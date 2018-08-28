import * as React from 'react';
import { isNumber } from 'lodash';
import {
  calculateHappiness,
  normalizeWellnessScore
} from '../../helpers/reporting';
import { TaskAssessmentStats } from '../../helpers/tasks';

interface TaskReportingTableProps {
  stats: TaskAssessmentStats[];
}

const getDeltaSymbol = (n: number) => {
  return n > 0 ? '+' : '';
};

const TaskReportingTable = ({ stats }: TaskReportingTableProps) => {
  const styles = {
    container: { marginTop: 24, marginBottom: 24 },
    lg: { width: '25%' },
    sm: { width: '15%' }
  };

  return (
    <table className='dashboard-list-table' style={styles.container}>
      <thead>
        <tr>
          <th style={styles.lg}>Task</th>
          <th style={styles.sm}>Count</th>
          {/* <th style={styles.sm}>Points</th> */}
          <th style={styles.sm}>Depression</th>
          <th style={styles.sm}>Anxiety</th>
          <th style={styles.sm}>Wellness</th>
          <th style={styles.sm}>Happiness</th>
        </tr>
      </thead>
      <tbody>
        {stats
          .map(stat => {
            const { task, count, stats } = stat;
            const { description, category } = task;
            const name = `${category}: ${description}`;
            const { depression, anxiety, wellbeing } = stats;
            const {
              included: dIncluded,
              excluded: dExcluded,
              delta: dDelta
            } = depression;
            const {
              included: aIncluded,
              excluded: aExcluded,
              delta: aDelta
            } = anxiety;
            const {
              included: _wIncluded,
              excluded: _wExcluded,
              delta: _wDelta
            } = wellbeing;
            const wIncluded = normalizeWellnessScore(_wIncluded);
            const wExcluded = normalizeWellnessScore(_wExcluded);
            const wDelta = normalizeWellnessScore(_wDelta);

            const happiness = calculateHappiness({
              depression: dIncluded,
              anxiety: aIncluded,
              wellness: wIncluded
            });

            const exHappiness = calculateHappiness({
              depression: dExcluded,
              anxiety: aExcluded,
              wellness: wExcluded
            });

            const hDelta = happiness - exHappiness;

            return {
              name,
              count,
              percentages: {
                happiness,
                depression: dIncluded,
                anxiety: aIncluded,
                wellness: wIncluded
              },
              deltas: {
                depression: dDelta,
                anxiety: aDelta,
                wellness: wDelta,
                happiness: hDelta
              }
            };
          })
          .sort((x, y) => {
            return y.percentages.happiness - x.percentages.happiness;
          })
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
              <tr key={key} className='dashboard-list-row'>
                <td style={styles.lg}>{name}</td>
                <td style={styles.sm}>{count} time(s)</td>
                <td style={styles.sm}>
                  {isNumber(depression) ? `${depression.toFixed(1)}%` : 'N/A'}{' '}
                  {isNumber(dDelta)
                    ? `(${getDeltaSymbol(dDelta)}${dDelta.toFixed(1)}%)`
                    : ''}
                </td>
                <td style={styles.sm}>
                  {isNumber(anxiety) ? `${anxiety.toFixed(1)}%` : 'N/A'}{' '}
                  {isNumber(aDelta)
                    ? `(${getDeltaSymbol(aDelta)}${aDelta.toFixed(1)}%)`
                    : ''}
                </td>
                <td style={styles.sm}>
                  {isNumber(wellness) ? `${wellness.toFixed(1)}%` : 'N/A'}{' '}
                  {isNumber(wDelta)
                    ? `(${getDeltaSymbol(wDelta)}${wDelta.toFixed(1)}%)`
                    : ''}
                </td>
                <td style={styles.sm}>
                  {isNumber(happiness) ? `${happiness.toFixed(1)}%` : 'N/A'}{' '}
                  {isNumber(hDelta)
                    ? `(${getDeltaSymbol(hDelta)}${hDelta.toFixed(1)}%)`
                    : ''}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default TaskReportingTable;
