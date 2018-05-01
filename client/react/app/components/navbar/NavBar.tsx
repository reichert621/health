import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { first } from 'lodash';
import { IUser, logout } from '../../helpers/auth';
import { AppState } from '../../helpers/utils';
import { getCurrentUser } from '../../reducers';
import './NavBar.less';

interface NavDropdownProps {
  user: IUser;
  isOpen: boolean;
  onToggle: () => void;
  onLogOut: () => void;
}

class NavDropdown extends React.Component<NavDropdownProps> {
  handleClickOutside: (e: any) => void;

  constructor(props: NavDropdownProps) {
    super(props);

    this.handleClickOutside = this.onClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onClickOutside(e: any) {
    const { isOpen, onToggle } = this.props;
    const el = (this.refs.dropdownMenu as HTMLElement);
    const isClickedOutside = !el.contains(e.target);

    if (isOpen && isClickedOutside) {
      onToggle();
    }
  }

  render() {
    if (!this.props.user) return null;

    const { user, isOpen, onToggle, onLogOut } = this.props;
    const { username = '' } = user;

    return (
      <div
        className={`dropdown ${isOpen ? 'open' : ''}`}
        ref='dropdownMenu'>
        <div
          className='nav-dropdown-toggle'
          onClick={onToggle}>
          {first(username)}
        </div>
        <div className='nav-dropdown-menu'>
          <Link to='/today'>
            <div className='dropdown-item first-item'
              style={{ paddingTop: 16, paddingBottom: 16 }}>
              Today
            </div>
          </Link>

          <Link to='/dashboard'>
            <div className='dropdown-item'>
              Dashboard
            </div>
          </Link>
          <Link to='/reporting'>
            <div className='dropdown-item'>
              Analytics
            </div>
          </Link>
          {/* <Link to='/gratitude'>
            <div className='dropdown-item'>
              Daily Gratitude
            </div>
          </Link>
          <Link to='/dos-and-donts'>
            <div className='dropdown-item'>
              Dos and Don'ts
            </div>
          </Link> */}
          <Link to='/tasks'>
            <div className='dropdown-item'
              style={{ marginBottom: 8 }}>
              My Tasks
            </div>
          </Link>
          {/* <Link to='/self-activation'>
            <div className='dropdown-item'>
              Self-Activation
            </div>
          </Link> */}

          <Link to='#'
            onClick={onLogOut}>
            <div className='dropdown-item last-item'
              style={{ paddingTop: 16, paddingBottom: 16 }}>
              Log Out
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

interface NavBarProps {
  title: string;
  history?: any;
  linkTo?: string;
  currentUser: IUser;
  dispatch: Dispatch<any>;
}

interface NavBarState {
  isDropdownOpen: boolean;
}

const mapStateToProps = (state: AppState) => {
  return { currentUser: state.currentUser };
};

class NavBar extends React.Component<NavBarProps, NavBarState> {
  constructor(props: NavBarProps) {
    super(props);

    this.state = {
      isDropdownOpen: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    return dispatch(getCurrentUser());
  }

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
    const { isDropdownOpen } = this.state;
    const { currentUser } = this.props;

    return (
      <NavDropdown
        user={currentUser}
        isOpen={isDropdownOpen}
        onToggle={() => this.setState({ isDropdownOpen: !isDropdownOpen })}
        onLogOut={this.logout.bind(this)} />
    );
  }

  renderLoggedOutNav() {
    return (
      <div style={{ marginTop: 16 }}>
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
    const { title, linkTo, history, currentUser } = this.props;
    const { isDropdownOpen } = this.state;
    const isLoggedIn = Boolean(currentUser && currentUser.id);

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

export default connect(mapStateToProps)(NavBar);
