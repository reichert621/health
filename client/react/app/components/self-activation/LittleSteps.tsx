import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const LittleSteps = () => {
  const rows = [
    {
      goal: 'Write a 500+ word essay',
      steps: [
        'Create an outline of the points I\'d like to make (1 - 2 hours)',
        'Research the topic for potential citations (1 - 2 days)',
        'Write a first draft (1 - 2 days)',
        'Edit the first draft (1 - 2 hours)',
        'Write the final draft (1 day)',
        'Publish the blog post (1 hour)'
      ]
    },
    {
      goal: 'Find a new job',
      steps: [
        'Update my resume (1 hour)',
        'Apply to 10 new companies (1 - 2 hours)',
        'Review data structures and algorithms (1 - 2 days)',
        'Practice some coding problems (1 - 2 days)',
        'Do a practice interview with a friend (1 hour)'
      ]
    }
  ];

  const styles = {
    sm: { width: '40%' },
    lg: { width: '60%' },
    text: { marginBottom: 16 }
  };

  return (
    <div>
      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.sm}>Goal</th>
            <th style={styles.lg}>Steps</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { goal, steps = [] } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.sm}>{goal}</td>
                  <td style={styles.lg}>
                    {
                      steps.map((step, k) => {
                        return (
                          <div key={k} style={styles.text}>
                            {step}
                          </div>
                        );
                      })
                    }
                  </td>
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
          title='Little Steps for Little Feet'
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <LittleSteps />
        </div>
      </div>
    );
  }
}
