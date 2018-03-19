import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const AntiProcrastinationSheet = () => {
  const rows = [
    {
      activity: 'Outline the paper.',
      predictedDifficulty: 90,
      predictedSatisfaction: 10,
      actualDifficulty: 10,
      actualSatisfaction: 60
    },
    {
      activity: 'Write a rough draft.',
      predictedDifficulty: 90,
      predictedSatisfaction: 10,
      actualDifficulty: 15,
      actualSatisfaction: 75
    },
    {
      activity: 'Write the final draft.',
      predictedDifficulty: 75,
      predictedSatisfaction: 10,
      actualDifficulty: 10,
      actualSatisfaction: 80
    },
    {
      activity: 'Review and send the paper.',
      predictedDifficulty: 50,
      predictedSatisfaction: 15,
      actualDifficulty: 0,
      actualSatisfaction: 95
    }
  ];

  const styles = {
    activity: { width: '28%' },
    cell: { width: '18%' }
  };

  return (
    <div>
      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.activity}>Activity</th>
            <th style={styles.cell}>Predicted Difficulty</th>
            <th style={styles.cell}>Predicted Satisfaction</th>
            <th style={styles.cell}>Actual Difficulty</th>
            <th style={styles.cell}>Actual Satisfaction</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const {
                activity,
                predictedDifficulty,
                predictedSatisfaction,
                actualDifficulty,
                actualSatisfaction
              } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.activity}>{activity}</td>
                  <td style={styles.cell}>{predictedDifficulty}%</td>
                  <td style={styles.cell}>{predictedSatisfaction}%</td>
                  <td style={styles.cell}>{actualDifficulty}%</td>
                  <td style={styles.cell}>{actualSatisfaction}%</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

export default class extends React.Component<RouteComponentProps<{}>> {
  render() {
    const { history } = this.props;

    return (
      <div>
        <NavBar
          title='Anti-Procrastination Sheet'
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <AntiProcrastinationSheet />
        </div>
      </div>
    );
  }
}
