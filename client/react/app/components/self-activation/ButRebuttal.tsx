import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';

const ButRebuttal = () => {
  const rows = [
    {
      column: 'I really should finish that task, but I\'m just not in the mood.',
      rebuttal: 'I\'ll feel more like it once get started.When I\'m done I\'ll feel terrific.'
    },
    {
      column: 'But there\'s so much to do, it would take forever.',
      rebuttal: 'It won\'t take as long as I expect.I can always just do a part of it now.'
    },
    {
      column: 'But I\'m too tired.',
      rebuttal: 'So just do some of it and then take a rest.'
    },
    {
      column: 'I\'d rather rest now and watch TV.',
      rebuttal: 'I can, but I won\'t feel very good about it knowing this task is hanging over my head.'
    },
    {
      column: 'But I\'m just too lazy to do it today.',
      rebuttal: 'That can\'t be true, I\'ve done things like this many times in the past.'
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
            <th style={styles.cell}>But Column</th>
            <th style={styles.cell}>But Rebuttal</th>
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row, key) => {
              const { column, rebuttal } = row;

              return (
                <tr key={key}
                  className='dashboard-list-row'>
                  <td style={styles.cell}>{column}</td>
                  <td style={styles.cell}>{rebuttal}</td>
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
          title='The But-Rebuttal Method'
          linkTo='/self-activation'
          history={history} />

        <div className='default-container'>
          <ButRebuttal />
        </div>
      </div>
    );
  }
}
