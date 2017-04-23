import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE
 } from './types';
import cookie from 'react-cookie';

const ROOT_URL = 'http://localhost:3090';

export function signinUser({ email, password}) {
  return function(dispatch) {
    // Submit email/password to the server
    axios.post(`${ROOT_URL}/signin`, { email, password })
      .then(response => {
        // If request is good...
        // - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });
        // - Save the JWT token
        cookie.save('token', response.data.token, { path: '/' });
        // - redirect to the route '/feature'
        browserHistory.push('/feature');
      })
      .catch(() => {
        // If request is bad...
        // - Show an error to the user
        dispatch(authError('Bad Login Info'));
      });
  }
}

export function signupUser({ email, password}) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { email, password})
      .then(response => {
        dispatch({ type: AUTH_USER });
        cookie.save('token', response.data.token, { path: '/', maxAge: 0 });
        browserHistory.push('/feature');
      })
      .catch(error => dispatch(authError(error.response.data.error)));
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function signoutUser() {
  cookie.remove('token', { path: '/' })

  return { type: UNAUTH_USER }
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: cookie.load('token') }
    })
      .then(response => {
        console.log(response);

        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      });
  }
}
