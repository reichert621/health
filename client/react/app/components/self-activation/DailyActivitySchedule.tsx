import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const DailyActivitySchedule = () => {
  const rows = [
    {
      hour: '8am - 9am',
      plan: 'Wake up, do 50 pushups, drink a glass of water, stretch',
      retrospective: 'Woke up a bit late, but felt good after doing pushups and stretching. (M)'
    },
    {
      hour: '9am - 10am',
      plan: 'Yoga for 30 mins, eat a healthy breakfast',
      retrospective: 'Yoga was tough, but I felt great afterward! For breakfast I made some scrambled eggs and a smoothie. (M)'
    },
    {
      hour: '10am - 11am',
      plan: 'Read for an hour',
      retrospective: 'I got a little tired of reading after 20 mins, so I took a break and watched some Netflix. (P)'
    },
    {
      hour: '11am - 12pm',
      plan: 'Go to the gym',
      retrospective: 'I had a great workout, got a good sweat and felt happy afterward. (M)'
    },
    {
      hour: '12pm - 1pm',
      plan: 'Make lunch, take a shower, meditate for 10 mins',
      retrospective: 'I\'m still struggling to meditate even for a few minutes, but I\'m glad I tried! (M/P)'
    },
    {
      hour: '1pm - 2pm',
      plan: 'Go to a cafe to work on a personal project',
      retrospective: 'It took me a bit longer to get out the door than I had hoped, but I made it out by 1:30pm. (M)'
    },
    {
      hour: '2pm - 5pm',
      plan: 'Work on a personal project',
      retrospective: 'I didn\'t get quite as much done as I\'d hoped, but I made some decent progress. (M)'
    },
    {
      hour: '5pm - 6pm',
      plan: 'Go for a walk, listen to a podcast',
      retrospective: 'It was a bit too cold outside for a walk, so I stayed home and listened to a podcast while stretching. (P)'
    },
    {
      hour: '6pm - 7pm',
      plan: 'Cook a healthy dinner',
      retrospective: 'For dinner, I cooked some salmon and made a salad. It felt good to eat healthy! (M/P)'
    },
    {
      hour: '6pm - 8pm',
      plan: 'Go out and grab a drink with a few friends',
      retrospective: 'It was nice to catch up with my friends. Had a great time planning our upcoming trip! (P)'
    }
  ];

  const styles = {
    sm: { width: '20%' },
    lg: { width: '40%' },
  };

  return (
    <div>
      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.sm}>Time</th>
            <th style={styles.lg}>Plan</th>
            <th style={styles.lg}>Retrospective</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { hour, plan, retrospective } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.sm}>{hour}</td>
                  <td style={styles.lg}>{plan}</td>
                  <td style={styles.lg}>{retrospective}</td>
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
          title={'Daily Activity Schedule'}
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <DailyActivitySchedule />
        </div>
      </div>
    );
  }
}
