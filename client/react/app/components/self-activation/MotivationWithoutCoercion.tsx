import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const MotivationWithoutCoercion = () => {
  const activity = 'Lying in Bed';
  const rows = [
    {
      advantage: 'It\'s easy.',
      disadvantage: 'While it seems easy, it gets awfully boring and painful after a while. It\'s actually not so easy to do nothing and just lie here moping and criticizing myself for hours.'
    },
    {
      advantage: 'I won\'t have to do anything of face my problems.',
      disadvantage: 'I won\'t be obliged to do anything if I get out of bed either, but it might make me feel better. If I avoid my problems, they won\'t go away, they\'ll just keep getting worse. I won\'t have the satisfaction of trying to solve them. The short-term discomfort of facing up to things is probably less depressing than the endless anguish of staying in bed.'
    },
    {
      advantage: 'I can sleep and escape.',
      disadvantage: 'I can\'t sleep forever, and I really don\'t need any more sleep since I have been sleeping nearly 16 hours a day. I will probably feel less fatigued if I get up and get my body moving.'
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
            <th style={styles.cell}>Advantages of {activity}</th>
            <th style={styles.cell}>Disadvantages of {activity}</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { advantage, disadvantage } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{advantage}</td>
                  <td style={styles.cell}>{disadvantage}</td>
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
          title='Motivation Without Coercion'
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <MotivationWithoutCoercion />
        </div>
      </div>
    );
  }
}
