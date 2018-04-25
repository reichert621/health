import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';
import METHODS from './methods';

const SelfActivation = () => {
  return (
    <table className='dashboard-list-table self-activation-table'>
      <thead>
        <tr>
          <th>Target Symptoms</th>
          <th>Self-Activation Technique</th>
          <th>Purpose of Method</th>
        </tr>
      </thead>
      <tbody>
        {
          METHODS.map((method, key) => {
            const { symptoms, technique, purpose, href } = method;

            return (
              <tr key={key}
                className='dashboard-list-row'>
                <td>{symptoms}</td>
                <td className='text-active'>
                  <Link to={href}>{technique}</Link>
                </td>
                <td>{purpose}</td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

class SelfActivationMethods extends React.Component<RouteComponentProps<{}>> {
  render() {
    const { history } = this.props;

    return (
      <div>
        <NavBar
          title='Self-Activation Methods'
          linkTo='/today'
          history={history} />

        <div className='default-container'>
          <SelfActivation />
        </div>
      </div>
    );
  }
}

export default SelfActivationMethods;
