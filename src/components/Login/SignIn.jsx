import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';

export const SignIn = ({ setIsRegisterMode, setErrMsg, setModalOpen }) => {

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const LOGIN_URL = '/auth';
  const { setAuth } = useAuth();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;

      setAuth({ user, pwd, roles, accessToken });
      setUser('');
      setPwd('');

      navigate(from, { replace: true });

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }

      open()

      setTimeout(() => {
        close()
      }, 3000);
    }
  }

  return (
    <form>
      <div>
        <input
          type="text"
          id="username"
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
        />
        <label>Username</label>
      </div>
      <div>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <label>Password</label>
      </div>
      <div>
        <a onClick={() => { handleSubmit() }}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          Sign In
        </a>
        <a onClick={() => setIsRegisterMode(true)}>Sign Up</a>
      </div>
    </form>
  )
}
