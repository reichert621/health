import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const TestYourCannots = () => {
  const rows = [
    {
      prediction: 'I could never read such a long book.',
      experiment: 'I read a page, and it wasn\'t too bad. Then I read a whole chapter!'
    },
    {
      prediction: 'I could never run a mile.',
      experiment: 'I jogged for half a mile, and then walked the rest of the way. I think I can do better next time.'
    },
    {
      prediction: 'I could never write a short story.',
      experiment: 'I set aside an hour to write, and I was able to come up with over 200 words. Better than nothing!'
    },
    {
      prediction: 'I can\'t make any friends.',
      experiment: 'I signed up to volunteer. I\'ll never make friends if I never leave the house.'
    }
  ];

  const styles = {
    cell: { width: '50%' }
  };

  return (
    <div>
      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.cell}>Negative Prediction</th>
            <th style={styles.cell}>Actual Experiment</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { prediction, experiment } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{prediction}</td>
                  <td style={styles.cell}>{experiment}</td>
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
          title={'Test Your Can\'ts'}
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <TestYourCannots />
        </div>
      </div>
    );
  }
}
