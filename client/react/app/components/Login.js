import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../helpers/auth';
import '../App.less';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: null
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    const { history } = this.props;
    const { username, password } = this.state;

    return login({ username, password })
      .then(() => history.push('/'))
      .catch(err => {
        console.log('Error logging in!', err);
        this.setState({ error: 'Invalid credentials' });
      });
  }

  render() {
    return (
      <div className="new-entry-container">
        <h1 className="entry-title">
          Log in
        </h1>

        <form onSubmit={this.handleSubmit.bind(this)}>
          <input
            type="text"
            className="input-default -large"
            placeholder="Username"
            name="username"
            value={this.state.username}
            onChange={
              (e) => this.setState({ username: e.target.value })
            } />

          <input
            type="password"
            className="input-default -large"
            placeholder="Password"
            name="password"
            value={this.state.password}
            onChange={
              (e) => this.setState({ password: e.target.value })
            } />

          <button
            className="button-default -large"
            type="submit">
            Log in
          </button>

          <small className="text-red">
            {this.state.error || ''}
          </small>
        </form>
      </div>
    );
  }
}

export default Login;
