import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const DisarmingTechnique = () => {
  const rows = [
    {
      criticism: 'Why can\'t you get out of bed and do something productive?',
      response: 'You\'re right. I\'ll feel better if I get up and go for a walk and listen to some music.'
    },
    {
      criticism: 'Why don\'t you ever do the dishes?',
      response: 'You\'re right that I often forget to do the dishes. It would feel great to have a clean kitchen, so I\'ll do that now.'
    },
    {
      criticism: 'Why are you so lazy?',
      response: 'You\'re right, I have been feeling pretty low on energy. I\'m going to walk to a coffee shop and read a book.'
    },
    {
      criticism: 'Why can\'t you keep your room clean?',
      response: 'You\'re right, my room is a bit cluttered. I\'d be able to enjoy it much more if everything looked nice and clean.'
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
            <th style={styles.cell}>Criticism</th>
            <th style={styles.cell}>Response</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { criticism, response } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{criticism}</td>
                  <td style={styles.cell}>{response}</td>
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
          title='The Disarming Technique'
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <DisarmingTechnique />
        </div>
      </div>
    );
  }
}
