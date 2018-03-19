import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const VisualizeSuccess = () => {
  const rows = [
    {
      activity: 'Exercising regularly',
      consequences: [
        'I\'ll improve my health.',
        'I\'ll have more stamina and energy.',
        'I\'ll live longer.'
      ]
    },
    {
      activity: 'Reading various types of literature',
      consequences: [
        'I\'ll learn more.',
        'It\'s a good mental workout.',
        'It will improve my ability to communicate and empathize.'
      ]
    },
    {
      activity: 'Writing essays',
      consequences: [
        'It will give me clarity of thought.',
        'It will help me become more articulate.',
        'It will lead to new ideas.'
      ]
    },
  ];

  const styles = {
    activity: { width: '40%' },
    consequences: { width: '60%' },
    text: { marginBottom: 8 }
  };

  return (
    <div>
      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.activity}>Activity</th>
            <th style={styles.consequences}>Positive Consequences</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { activity, consequences } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.activity}>{activity}</td>
                  <td style={styles.consequences}>
                    {
                      consequences.map((text, k) => {
                        return (
                          <div key={k} style={styles.text}>
                            {text}
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
          title='Visualize Success'
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <VisualizeSuccess />
        </div>
      </div>
    );
  }
}
