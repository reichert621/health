import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { login } from '../../helpers/auth';
import NavBar from '../navbar';
import '../../App.less';

interface LoginProps {}

interface LoginState {
  username: string;
  password: string;
  error?: string;
}

class Login extends React.Component<LoginProps & RouteComponentProps<{}>, LoginState> {
  constructor(props: LoginProps & RouteComponentProps<{}>) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: null
    };
  }

  onUpdateInput(e: any) {
    return this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e: React.FormEvent<HTMLInputElement>) {
    e.preventDefault();

    const { history } = this.props;
    const { username, password } = this.state;
    const credentials = {
      password,
      username: username.trim()
    };

    return login(credentials)
      .then(() => history.push('/activities'))
      .catch(err => {
        console.log('Error logging in!', err);
        this.setState({ error: 'Invalid credentials' });
      });
  }

  render() {
    return (
      <div className='default-wrapper simple'>
        <NavBar active='login' isLoggedOut={true} />

        <form className='login-form'
          onSubmit={this.handleSubmit.bind(this)}>
          <input
            type='text'
            className='input-default -lg'
            placeholder='Username'
            name='username'
            value={this.state.username}
            onChange={this.onUpdateInput.bind(this)} />

          <input
            type='password'
            className='input-default -lg'
            placeholder='Password'
            name='password'
            value={this.state.password}
            onChange={this.onUpdateInput.bind(this)} />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link to='signup' className='btn-link -primary btn-signup'>
              Sign up
            </Link>

            <button
              className='btn-link -primary btn-login'
              type='submit'>
              Log in
            </button>
          </div>

          <small className='text-red'
            style={{ marginLeft: 16 }}>
            {this.state.error || ''}
          </small>
        </form>
      </div>
    );
  }
}

export default Login;
