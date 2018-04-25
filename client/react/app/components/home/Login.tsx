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
      .then(() => history.push('/today'))
      .catch(err => {
        console.log('Error logging in!', err);
        this.setState({ error: 'Invalid credentials' });
      });
  }

  render() {
    return (
      <div>
        <NavBar title='Log in' />

        <div className='default-container'>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <input
              type='text'
              className='input-default -large'
              placeholder='Username'
              name='username'
              value={this.state.username}
              onChange={this.onUpdateInput.bind(this)} />

            <input
              type='password'
              className='input-default -large'
              placeholder='Password'
              name='password'
              value={this.state.password}
              onChange={this.onUpdateInput.bind(this)} />

            <button
              className='btn-default btn-sm'
              type='submit'>
              Log in
            </button>

            <small className='text-red'
              style={{ marginLeft: 16 }}>
              {this.state.error || ''}
            </small>

            <div style={{ marginTop: 16 }}>
              <small>
                Or click <Link to='signup'>here</Link> to sign up!
              </small>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
