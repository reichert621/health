import React from 'react';
import { Link } from 'react-router-dom';
import { login } from '../../helpers/auth';
import NavBar from '../navbar';
import '../../App.less';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      error: null
    };

    this.onSubmit = this.handleSubmit.bind(this);
    this.updateInput = this.onUpdateInput.bind(this);
  }

  onUpdateInput(e) {
    return this.setState({
      [e.target.name]: e.target.value
    });
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
      <div>
        <NavBar title="Log in" />

        <div className="default-container">
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              className="input-default -large"
              placeholder="Username"
              name="username"
              value={this.state.username}
              onChange={this.updateInput} />

            <input
              type="password"
              className="input-default -large"
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.updateInput} />

            <button
              className="btn-default btn-sm"
              type="submit">
              Log in
            </button>

            <small className="text-red"
              style={{ marginLeft: 16 }}>
              {this.state.error || ''}
            </small>

            <div style={{ marginTop: 16 }}>
              <small>
                Or click <Link to="signup">here</Link> to sign up!
              </small>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
