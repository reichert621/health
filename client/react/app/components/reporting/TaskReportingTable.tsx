import * as React from 'react';
import { isNumber } from 'lodash';
import {
  ReportingTask,
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
    sm: { width: '15%' },
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
        {
          stats
            .sort((x, y) => {
              return y.stats.wellbeing.included - x.stats.wellbeing.included;
            })
            .map((stat, key) => {
              const {
                task,
                count,
                stats
              } = stat;
              const { description, category } = task;
              const name = `${category}: ${description}`;
              const { depression, anxiety, wellbeing } = stats;
              const { included: dIncluded, delta: dDelta } = depression;
              const { included: aIncluded, delta: aDelta } = anxiety;
              const { included: _wIncluded, delta: _wDelta } = wellbeing;
              const wIncluded = normalizeWellnessScore(_wIncluded);
              const wDelta = normalizeWellnessScore(_wDelta);

              const happiness = calculateHappiness({
                depression: dIncluded,
                anxiety: aIncluded,
                wellness: wIncluded
              });

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.lg}>{name}</td>
                  <td style={styles.sm}>{count} times</td>
                  <td style={styles.sm}>
                    {isNumber(dIncluded) ? `${dIncluded.toFixed(1)}%` : 'N/A'}
                    {' '}
                    {isNumber(dDelta)
                      ? `(${getDeltaSymbol(dDelta)}${dDelta.toFixed(1)}%)`
                      : ''}
                  </td>
                  <td style={styles.sm}>
                    {isNumber(aIncluded) ? `${aIncluded.toFixed(1)}%` : 'N/A'}
                    {' '}
                    {isNumber(aDelta)
                      ? `(${getDeltaSymbol(aDelta)}${aDelta.toFixed(1)}%)`
                      : ''}
                  </td>
                  <td style={styles.sm}>
                    {isNumber(wIncluded) ? `${wIncluded.toFixed(1)}%` : 'N/A'}
                    {' '}
                    {isNumber(wDelta)
                      ? `(${getDeltaSymbol(wDelta)}${wDelta.toFixed(1)}%)`
                      : ''}
                  </td>
                  <td style={styles.sm}>
                    {isNumber(happiness) ? `${happiness.toFixed(1)}%` : 'N/A'}
                  </td>
                </tr>
              );
            })
        }
      </tbody>
    </table>
  );
};

export default TaskReportingTable;
