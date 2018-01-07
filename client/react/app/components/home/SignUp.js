import React from 'react';
import { get } from 'lodash';
import { signup } from '../../helpers/auth';
import '../../App.less';

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      error: null
    };
  }

  onUpdateInput(e) {
    return this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const { history } = this.props;
    const { username, email, password, passwordConfirmation } = this.state;

    if (!username) {
      return this.setState({ error: 'A valid username is required!' });
    } else if (!email) {
      return this.setState({ error: 'A valid email is required!' });
    } else if (!password) {
      return this.setState({ error: 'A password is required!' });
    } else if (password !== passwordConfirmation) {
      return this.setState({ error: 'Password does not match password confirmation!' });
    }

    return signup({ username, email, password })
      .then(() => history.push('/signup-complete'))
      .catch(err => {
        const error = get(err, 'message', 'Invalid credentials!');

        this.setState({ error });
      });
  }

  render() {
    return (
      <div className="default-container">
        <h1 className="login-header">
          Sign up
        </h1>

        <form onSubmit={this.handleSubmit.bind(this)}>
          <input
            type="text"
            className="input-default -large"
            placeholder="Username"
            name="username"
            value={this.state.username}
            onChange={this.onUpdateInput.bind(this)} />

          <input
            type="email"
            className="input-default -large"
            placeholder="Email"
            name="email"
            value={this.state.email}
            onChange={this.onUpdateInput.bind(this)} />

          <input
            type="password"
            className="input-default -large"
            placeholder="Password"
            name="password"
            value={this.state.password}
            onChange={this.onUpdateInput.bind(this)} />

          <input
            type="password"
            className="input-default -large"
            placeholder="Confirm Password"
            name="passwordConfirmation"
            value={this.state.passwordConfirmation}
            onChange={this.onUpdateInput.bind(this)} />

          <button
            className="btn-default btn-sm"
            type="submit">
            Sign Up
          </button>

          <small className="text-red"
            style={{ marginLeft: 16 }}>
            {this.state.error || ''}
          </small>
        </form>
      </div>
    );
  }
}

export default SignUp;
