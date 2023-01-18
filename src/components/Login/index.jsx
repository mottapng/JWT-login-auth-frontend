import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion'
import Modal from '../Modal'

import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import "./login.scss"

const LOGIN_URL = '/auth';

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

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
    }

    open()

    setTimeout(() => {
      close()
    }, 3000);
  }

  return (
    <>

      <div className="login-container">
        <h2>Administrativo</h2>
        <form>
          <div>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />
            <label>Email</label>
          </div>
          <div>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <label>Senha</label>
          </div>
          <div>
            <a onClick={() => { handleSubmit() }}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Sign In
            </a>
            <Link to="/register">Sign Up</Link>
          </div>
        </form>
      </div>
      <div className="modal-container">
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        >
          {modalOpen && <Modal handleClose={close} text={errMsg} />}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Login