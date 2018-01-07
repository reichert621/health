import React from 'react';
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
    const params = { username, email, password };

    console.log(params);
    return signup(params)
      .then(() => history.push('/signup-complete'))
      .catch(err => {
        console.log('Error signing up!', err);
        this.setState({ error: 'Invalid user!' });
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

          <small className="text-red">
            {this.state.error || ''}
          </small>
        </form>
      </div>
    );
  }
}

export default SignUp;
