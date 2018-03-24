import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const CountWhatCounts = () => {
  const rows = [
    {
      time: '8:00 am',
      activity: 'I woke up and got out of bed without hitting the snooze button.'
    },
    {
      time: '8:30 am',
      activity: 'I watered my plants before leaving the apartment. They\'re looking healthy!'
    },
    {
      time: '9:40 am',
      activity: 'I had a nice interaction with the cashier at the local coffee shop.'
    },
    {
      time: '10:30 am',
      activity: 'I noticed I was slouching at my desk and corrected my posture.'
    },
    {
      time: '11:45 am',
      activity: 'I finished most of my work for the day, and it\'s not even lunch time yet!'
    },
    {
      time: '12:20 am',
      activity: 'I drank water with lunch instead of a Coke.'
    },
    {
      time: '2:00 pm',
      activity: 'I spoke up during a meeting and voiced an opinion that several people agreed with and appreciated.'
    },
    {
      time: '5:20 pm',
      activity: 'I went to the gym after work, despite feeling pretty tired from the day.'
    }
  ];

  const styles = {
    sm: { width: '20%' },
    lg: { width: '80%' },
  };

  return (
    <div>
      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.sm}>Time</th>
            <th style={styles.lg}>Positive Activity</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { time, activity } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.sm}>{time}</td>
                  <td style={styles.lg}>{activity}</td>
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
          title='Count What Counts'
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <CountWhatCounts />
        </div>
      </div>
    );
  }
}
