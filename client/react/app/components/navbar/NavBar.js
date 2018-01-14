import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../../helpers/auth';
import './NavBar.less';

class NavBar extends React.Component {
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

  render() {
    const { title, linkTo, history } = this.props;

    return (
      <div className="nav-container">
        <div className="nav-content clearfix">
          <h1 className="nav-header pull-left">
            <Link to={linkTo || '#'}
              className={linkTo ? '' : 'hidden'}>
              <img className="back-icon" src="assets/back-arrow.svg" />
            </Link>
            {title}
          </h1>

          <div className="logout-container pull-right">
            {
              /* TODO: this is a bit of a hack to know if user is logged in */
              history &&
              <Link to="/tasks"
                className="nav-link">
                Tasks
              </Link>
            }

            {/* TODO: unhide when content is ready */}
            <Link to="/about"
              className="nav-link hidden">
              About
            </Link>

            {
              /* TODO: this is a bit of a hack to know if user is logged in */
              history &&
              <Link to="#"
                className="nav-link"
                onClick={this.logout.bind(this)}>
                Logout
              </Link>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default NavBar;
