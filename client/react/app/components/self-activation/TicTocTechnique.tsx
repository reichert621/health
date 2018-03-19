import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const TicTocTechnique = () => {
  const rows = [
    {
      tic: 'I\'ll never be able to clean out the garage.',
      toc: 'Overgeneralization; all-or-nothing thinking. Just do a little bit and get started. There\'s no reason to do it all today.'
    },
    {
      tic: 'My work isn\'t very important or exciting.',
      toc: 'Disqualifying the positive. It may seem routine to me, but it\'s quite important to the people I work with.I get to be creative, and sometimes it can be very enjoyable.Maybe I could do something more exciting in my free time?'
    },
    {
      tic: 'Writing this paper is pointless.',
      toc: 'All-or-nothing thinking. It doesn\'t have to be a masterpiece.I might learn something, and it\'ll feel good to get it done.'
    },
    {
      tic: 'If I lose this deal, I\'ll be a laughing stock.',
      toc: 'Fortune-teller error; labeling. It\'s not shameful to lose a deal. A lot of people respect me and my work.'
    },
    {
      tic: 'If I talk to that girl, she\'ll reject me. What\'s the point?',
      toc: 'Fortune-teller error; overgeneralization. They can\'t all turn me down, and it\'s not shameful to try. I can learn from rejection. I\'ve got to practice to improve.'
    },
    {
      tic: 'This work has to be great, but I\'m not feeling very creative or motivated.',
      toc: 'All-or-nothing thinking. Just prepare an adequate draft. I can improve it later.'
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
            <th style={styles.cell}>Task-Interfering Cognitions (TIC)</th>
            <th style={styles.cell}>Task-Oriented Cognitions (TOC)</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { tic, toc } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{tic}</td>
                  <td style={styles.cell}>{toc}</td>
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
          title='The TIC-TOC Technique'
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <TicTocTechnique />
        </div>
      </div>
    );
  }
}
