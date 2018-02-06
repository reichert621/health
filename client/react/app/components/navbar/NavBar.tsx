import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { logout } from '../../helpers/auth';
import './NavBar.less';

interface NavBarProps {
  title: string;
  history?: any;
  linkTo?: string;
}

class NavBar extends React.Component<NavBarProps> {
  logout() {
    const { history } = this.props;

    return logout()
      .then(() => {
        return history.push('/login');
      })
      .catch(err => {
        console.log('Error logging out!', err);
      });
  }

  renderLoggedInNav() {
    return (
      <div>
        <Link to='/tasks'
          className='nav-link'>
          Tasks
        </Link>

        <Link to='/reporting'
          className='nav-link'>
          Reporting
        </Link>

        <Link to='#'
          className='nav-link'
          onClick={this.logout.bind(this)}>
          Logout
        </Link>
      </div>
    );
  }

  renderLoggedOutNav() {
    return (
      <div>
        <Link to='/signup'
          className='nav-link'>
          Sign up
        </Link>

        <Link to='/about'
          className='nav-link'>
          About
        </Link>

        <Link to='/login'
          className='nav-link'>
          Log in
        </Link>
      </div>
    );
  }

  render() {
    const { title, linkTo, history } = this.props;
    const isLoggedIn = !!history;

    return (
      <div className='nav-container'>
        <div className='nav-content clearfix'>
          <h1 className='nav-header pull-left'>
            <Link to={linkTo || '#'}
              className={linkTo ? '' : 'hidden'}>
              <img className='back-icon' src='assets/back-arrow.svg' />
            </Link>
            {title}
          </h1>

          <div className='logout-container pull-right'>
            {
              isLoggedIn ?
                this.renderLoggedInNav() :
                this.renderLoggedOutNav()
            }
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
