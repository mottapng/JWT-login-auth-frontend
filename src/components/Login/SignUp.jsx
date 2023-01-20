import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

export const SignUp = ({ setIsRegisterMode, setErrMsg, setModalOpen }) => {
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
    (userFocus && user && !validName) ?
      (setErrMsg("Username must have: 4 to 24 characters,\nBegin with a letter,\nLetters, numbers, underscores, hyphens allowed."), open()) :
      ((userFocus && user && validName) || (!user)) ?
        close() : undefined
  }, [user, validName, userFocus])

  useEffect(() => {
    (pwdFocus && !validPwd) ?
      (setErrMsg("Password must have: 8 to 24 characters,\nUppercase and lowercase letters, a number and a special character,\nAllowed special characters: !, @, #"), open()) :
      (pwdFocus && pwd && validPwd) ?
        close() : undefined
  }, [pwd, validPwd, pwdFocus])

  useEffect(() => {
    (matchFocus && matchPwd && !validMatch) ?
      (setErrMsg("Must match the first password input field"), open()) :
      (matchFocus && matchPwd && validMatch) ?
        close() : undefined
  }, [matchPwd, validMatch, matchFocus])

  const renderButtons = () => {
    if (!success)
      return (
        <div>
          <a onClick={() => { handleSubmit() }}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Sign up
          </a>
          <a onClick={() => setIsRegisterMode(isRegisterMode => !isRegisterMode)}>
            Sign In
          </a>

        </div>
      )
    return (
      <div className="loading">
        <svg viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (!validName || !validPwd || !validMatch)
      return

    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const response = await axios.post(REGISTER_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      console.log('foi')
      console.log(JSON.stringify(response?.data));

      setSuccess(true);
      setErrMsg("Account Created with Success!")
      open()

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed')
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
          aria-invalid={validName ? "false" : "true"}
          aria-describedby="uidnote"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
          onFocus={() => setUserFocus(true)}
          onBlur={() => setUserFocus(false)}
          style={{
            borderBottom: (validName || !user) ? "1px solid #fff" : "1px solid #ED4747",
            color: (validName || !user) ? "#fff" : "#ED4747"
          }}
        />
        <label style={{ color: (validName || !user) ? "#fff" : "#ED4747" }}>
          Username
        </label>
      </div>
      <div>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
          aria-invalid={validPwd ? "false" : "true"}
          aria-describedby="pwdnote"
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
          style={{
            borderBottom: (validPwd || !pwd) ? "1px solid #fff" : "1px solid #ED4747",
            color: (validPwd || !pwd) ? "#fff" : "#ED4747"
          }}
        />
        <label style={{ color: (validPwd || !pwd) ? "#fff" : "#ED4747" }}>
          Password
        </label>
      </div>
      <div>
        <input
          type="password"
          id="confirm_pwd"
          onChange={(e) => setMatchPwd(e.target.value)}
          value={matchPwd}
          required
          aria-invalid={validMatch ? "false" : "true"}
          aria-describedby="confirmnote"
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
          style={{
            borderBottom: (validMatch || !matchPwd) ? "1px solid #fff" : "1px solid #ED4747",
            color: (validMatch || !matchPwd) ? "#fff" : "#ED4747"
          }}
        />
        <label style={{ color: (validMatch || !matchPwd) ? "#fff" : "#ED4747" }}>
          Confirm Password
        </label>
      </div>
      {renderButtons()}
    </form>
  )
}
