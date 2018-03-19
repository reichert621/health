import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const PleasurePredicting = () => {
  const rows = [
    {
      activity: 'Reading',
      withWhom: 'Self',
      predictedSatisfaction: 40,
      actualSatisfaction: 60
    },
    {
      activity: 'Dinner with Rob',
      withWhom: 'Rob',
      predictedSatisfaction: 70,
      actualSatisfaction: 80
    },
    {
      activity: 'Art Museum',
      withWhom: 'Self',
      predictedSatisfaction: 50,
      actualSatisfaction: 80
    },
    {
      activity: 'Susan\'s Party',
      withWhom: 'Susan and friends',
      predictedSatisfaction: 80,
      actualSatisfaction: 60
    },
    {
      activity: 'Jogging',
      withWhom: 'Self',
      predictedSatisfaction: 60,
      actualSatisfaction: 70
    }
  ];

  const styles = {
    cell: { width: '25%' }
  };

  return (
    <div>
      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.cell}>Activity</th>
            <th style={styles.cell}>With Whom?</th>
            <th style={styles.cell}>Predicted Satisfaction</th>
            <th style={styles.cell}>Actual Satisfaction</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const {
                activity,
                withWhom,
                predictedSatisfaction,
                actualSatisfaction
              } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{activity}</td>
                  <td style={styles.cell}>{withWhom}</td>
                  <td style={styles.cell}>{predictedSatisfaction}%</td>
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
          title='Pleasure Predicting Sheet'
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <PleasurePredicting />
        </div>
      </div>
    );
  }
}
