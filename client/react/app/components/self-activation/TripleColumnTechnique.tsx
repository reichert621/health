import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const TripleColumnTechnique = () => {
  const rows = [
    {
      thought: 'I never do anything right.',
      distortion: 'Overgeneralization.',
      response: 'Not true! I do a lot of things right.'
    },
    {
      thought: 'I\'m always late.',
      distortion: 'Overgeneralization.',
      response: 'I\'m not always late. I\'ve been on time plenty of times. If I\'m late more often than I\'d like, I\'ll work on this problem and develop a method to overcome it.'
    },
    {
      thought: 'Everyone will look down on me.',
      distortion: 'Mind reading. Overgeneralization. All-or-nothing thinking. Fortune teller error.',
      response: 'Someone may be disappointed, but it\'s not the end of the world.'
    },
    {
      thought: 'This shows what a jerk I am.',
      distortion: 'Labeling.',
      response: 'Come on, now. I\'m not "a jerk."'
    },
    {
      thought: 'I\'ll make a fool of myself.',
      distortion: 'Labeling. Fortune teller error.',
      response: 'I\'m not "a fool" either.I may appear foolish sometimes, but that doesn\'t make me a fool. Everyone makes mistakes sometimes.'
    }
  ];

  return (
    <div>
      <table className='dashboard-list-table self-activation-table'
        style={{ marginTop: 40 }}>
        <thead>
          <tr>
            <th>Automatic Thought</th>
            <th>Cognitive Distortion</th>
            <th>Rational Response</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { thought, distortion, response } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td>{thought}</td>
                  <td>{distortion}</td>
                  <td>{response}</td>
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
          title='Triple Column Technique'
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <TripleColumnTechnique />
        </div>
      </div>
    );
  }
}
