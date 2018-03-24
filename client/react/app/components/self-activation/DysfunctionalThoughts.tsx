import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const DysfunctionalThoughts = () => {
  const rows = [
    {
      situation: 'I stayed in bed all morning with no desire or energy to get up.',
      emotions: ['Depressed', 'Tired', 'Lonely', 'Guilty'],
      negativeThoughts: [
        'I just don\'t want to do anything',
        'I\'m a failure as a person',
        'I have no hobbies or interests'
      ],
      rationalResponses: [
        'That\'s because I\'m doing nothing, and getting lost in negative thoughts.',
        'I\'m not a failure, I have had successes when I set my mind to things.',
        'That\'s not true, there are plenty of things I enjoy doing once I get started.'
      ],
      outcome: 'I got up, took a shower, and went for a walk. It made me feel better.'
    },
    {
      situation: 'I spent the afternoon watching TV instead of going to the gym.',
      emotions: ['Guilty', 'Self-loathing', 'Tired'],
      negativeThoughts: [
        'I can always go to the gym tomorrow instead',
        'I don\'t have the energy to exercise right now anyway',
        'Everyone at the gym is in better shape than I am'
      ],
      rationalResponses: [
        'If I always think that way, I\'ll just keep procrastinating and never go.',
        'Getting up and going will give me an energy boost.',
        'That\'s not true, and even if it was, no one at the gym is judging me anyways.'
      ],
      outcome: 'I went to the gym for just 30 minutes. It was difficult, but I had more energy afterward.'
    },
  ];

  const styles = {
    cell: { width: '20%' },
    text: { marginBottom: 16 }
  };

  return (
    <div>
      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th style={styles.cell}>Situation</th>
            <th style={styles.cell}>Emotions</th>
            <th style={styles.cell}>Negative Thoughts</th>
            <th style={styles.cell}>Rational Responses</th>
            <th style={styles.cell}>Outcome</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const {
                situation,
                emotions = [],
                negativeThoughts = [],
                rationalResponses = [],
                outcome
              } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{situation}</td>
                  <td style={styles.cell}>
                    {
                      emotions.map((emotion, k) => {
                        return (
                          <div key={k} style={styles.text}>
                            {emotion}
                          </div>
                        );
                      })
                    }
                  </td>
                  <td style={styles.cell}>
                    {
                      negativeThoughts.map((thought, k) => {
                        return (
                          <div key={k} style={styles.text}>
                            {thought}
                          </div>
                        );
                      })
                    }
                  </td>
                  <td style={styles.cell}>
                    {
                      rationalResponses.map((response, k) => {
                        return (
                          <div key={k} style={styles.text}>
                            {response}
                          </div>
                        );
                      })
                    }
                  </td>
                  <td style={styles.cell}>{outcome}</td>
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
          title='Dysfunctional Thoughts'
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <DysfunctionalThoughts />
        </div>
      </div>
    );
  }
}
