import * as React from 'react';
import { ReportingTask } from '../../helpers/reporting';

interface TaskReportingTableProps {
  stats: ReportingTask[];
}

const TaskReportingTable = ({ stats }: TaskReportingTableProps) => {
  const styles = {
    container: { marginTop: 24, marginBottom: 24 },
    lg: { width: '40%' },
    sm: { width: '20%' },
  };

  return (
    <table className='dashboard-list-table' style={styles.container}>
      <thead>
        <tr>
          <th style={styles.lg}>Task</th>
          <th style={styles.sm}>Total Count</th>
          <th style={styles.sm}>Total Points</th>
          <th style={styles.sm}>Average Mood</th>
        </tr>
      </thead>
      <tbody>
        {
          stats
            .sort((x, y) => y.happiness - x.happiness)
            .map((stat, key) => {
              const { task, count, points, happiness } = stat;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.lg}>{task}</td>
                  <td style={styles.sm}>{count} times</td>
                  <td style={styles.sm}>{points} points</td>
                  <td style={styles.sm}>{happiness.toFixed(1)}% happy</td>
                </tr>
              );
            })
        }
      </tbody>
    </table>
  );
};

export default TaskReportingTable;
