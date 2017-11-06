/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Register.css';
import history from '../../history';

class Register extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    fetch: PropTypes.func.isRequired,
  };
  state = {};
  onSubmit = e => {
    e.preventDefault();
    const error = this.validateInput();
    if (error) {
      this.setState({ error });
    } else {
      this.setState({ loading: true });
      this.props
        .fetch('/signup', {
          method: 'POST',
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
          }),
        })
        .then(() => {
          history.push('/');
        })
        .catch(error => {
          console.log(error);
          this.setState({ email: 'this email already taken' });
        });
    }
  };
  bindValue = field => ({
    value: this.state[field] || '',
    onChange: e => this.setState({ [field]: e.target.value }),
  });
  validateInput = () => {
    const { email, password, retypePassword } = this.state;
    const error = {};
    if (!email) {
      error.email = 'email is required!';
    }
    if (!password) {
      error.password = 'password is required!';
    }
    if (!retypePassword) {
      error.retypePassword = 'retypePassword is required!';
    }
    if (password !== retypePassword) {
      error.password = 'password not match retype';
      error.retypePassword = 'password not match retype';
    }
    if (Object.keys(error).length === 0) {
      return undefined;
    }
    return error;
  };

  render() {
    return (
      <div className={s.root}>
        <div className={`${s.container} d-flex flex-column align-items-center`}>
          <h1>{this.props.title}</h1>
          <form
            style={{ width: 380 }}
            action="/signup"
            method="post"
            onSubmit={this.onSubmit}
          >
            <div>
              <label>Email</label>
              <input
                {...this.bindValue('email')}
                type="email"
                className="form-control"
              />
              {this.state.error &&
                this.state.error.email && (
                  <p className="text-danger"> {this.state.error.email} </p>
                )}
            </div>
            <div>
              <label>Password</label>
              <input
                {...this.bindValue('password')}
                type="password"
                className="form-control"
              />
              {this.state.error &&
                this.state.error.password && (
                  <p className="text-danger"> {this.state.error.password} </p>
                )}
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                {...this.bindValue('retypePassword')}
                type="password"
                className="form-control"
              />
              {this.state.error &&
                this.state.error.retypePassword && (
                  <p className="text-danger">
                    {this.state.error.retypePassword}
                  </p>
                )}
            </div>
            <input type="hidden" name="fallBackUrl" value="/" />
            <div className="mt-2 d-flex">
              <button className="btn btn-primary" style={{ flex: 1 }}>
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Register);
