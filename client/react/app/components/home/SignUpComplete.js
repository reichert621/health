import React from 'react';
import { Link } from 'react-router-dom';

const SignUpComplete = () => {
  return (
    <div className="default-container">
      <h1 className="signup-header">
        Thanks for signing up!
      </h1>

      <div>
        Click <Link to="/login">here</Link> to login.
      </div>
    </div>
  );
};

export default SignUpComplete;
