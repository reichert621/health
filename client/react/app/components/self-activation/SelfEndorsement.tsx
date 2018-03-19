import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const SelfEndorsement = () => {
  const rows = [
    {
      selfDowning: 'Anybody could clean these dishes.',
      selfEndorsing: 'If it\'s a routine, boring chore, I deserve extra credit for doing it.'
    },
    {
      selfDowning: 'There\'s no point in cleaning them.They will just get dirty again.',
      selfEndorsing: 'That\'s the point. They\'ll be clean when I need them.'
    },
    {
      selfDowning: 'I could\'ve done a better job fixing up my room.',
      selfEndorsing: 'Nothing is perfect, but I did make the room look a lot better!'
    },
    {
      selfDowning: 'It was just luck that my speech was successful.',
      selfEndorsing: 'It wasn\'t a matter of luck.I prepared well and delivered my talk effectively.'
    },
    {
      selfDowning: 'I washed my car, but it still doesn\'t look as good as my friend\'s new car.',
      selfEndorsing: 'The car looks much better than it did before, and I\'ll really enjoy driving it around.'
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
            <th style={styles.cell}>Self-Downing Statement</th>
            <th style={styles.cell}>Self-Endorsing Statement</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { selfDowning, selfEndorsing } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{selfDowning}</td>
                  <td style={styles.cell}>{selfEndorsing}</td>
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
          title='The Self-Endorsement Technique'
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <SelfEndorsement />
        </div>
      </div>
    );
  }
}
