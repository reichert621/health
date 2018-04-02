import * as React from 'react';
import { ChecklistQuestionStats } from '../../helpers/reporting';

interface MoodReportingTableProps {
  stats: ChecklistQuestionStats[];
}

const MoodReportingTable = ({ stats }: MoodReportingTableProps) => {
  const styles = {
    container: { marginTop: 24, marginBottom: 24 }
  };

  return (
    <table className='dashboard-list-table' style={styles.container}>
      <thead>
        <tr>
          <th>Question</th>
          <th>Average Score</th>
          <th>Frequency</th>
        </tr>
      </thead>
      <tbody>
        {
          stats.map((stat, key) => {
            const { question, scores, average } = stat;
            const score = (average / 4) * 100;
            const frequency = scores.filter(s => s > 0).length;

            return (
              <tr key={key}
                className='dashboard-list-row'>
                <td>{question}</td>
                <td>{score.toFixed(1)}%</td>
                <td>{frequency}</td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

export default MoodReportingTable;
