import * as React from 'react';
import { isNumber } from 'lodash';
import { ReportingTask } from '../../helpers/reporting';

interface TaskReportingTableProps {
  stats: ReportingTask[];
}

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
            .sort((x, y) => y.wellness - x.wellness)
            .map((stat, key) => {
              const {
                task,
                count,
                points,
                depression,
                anxiety,
                wellness,
                happiness
              } = stat;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.lg}>{task}</td>
                  <td style={styles.sm}>{count} times</td>
                  {/* <td style={styles.sm}>{points} points</td> */}
                  <td style={styles.sm}>
                    {isNumber(depression) ? `${depression.toFixed(1)}%` : 'N/A'}
                  </td>
                  <td style={styles.sm}>
                    {isNumber(anxiety) ? `${anxiety.toFixed(1)}%` : 'N/A'}
                  </td>
                  <td style={styles.sm}>
                    {isNumber(wellness) ? `${wellness.toFixed(1)}%` : 'N/A'}
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
