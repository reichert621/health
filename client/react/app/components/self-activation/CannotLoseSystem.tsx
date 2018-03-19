import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const CannotLoseSystem = () => {
  const activity = 'Being Rejected';
  const rows = [
    {
      negativeConsequence: 'This means I\'ll never get a job.',
      copingStrategy: 'Overgeneralization. This is unlikely. I can test this by applying for a series of other jobs and putting my best foot forward.'
    },
    {
      negativeConsequence: 'My friends will look down on me.',
      copingStrategy: 'Fortune-teller error. Maybe they will be sympathetic.'
    },
    {
      negativeConsequence: 'If they\'re not sympathetic, they might say this shows I don\'t have what it takes.',
      copingStrategy: 'Point out that I\'m doing my best and that negative attitude doesn\'t help.'
    },
    {
      negativeConsequence: 'But I\'m nearly broke, and I need the money.',
      copingStrategy: 'I\'ve survived so far. I have friends and family that are there for me if I really need them.'
    },
    {
      negativeConsequence: 'A lot of my friends have jobs. They\'ll see I can\'t handle the business world.',
      copingStrategy: 'They\'re not all employed, and even the ones that do have jobs can probably remember a time when they were struggling to find work.'
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
            <th style={styles.cell}>Negative Consequences of {activity}</th>
            <th style={styles.cell}>Positive Thoughts and Coping Strategies</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { negativeConsequence, copingStrategy } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{negativeConsequence}</td>
                  <td style={styles.cell}>{copingStrategy}</td>
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
          title={'The "Can\'t Lose" System'}
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <CannotLoseSystem />
        </div>
      </div>
    );
  }
}
