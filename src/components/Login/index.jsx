import { useState, useEffect } from 'react';

import { AnimatePresence } from 'framer-motion'
import Modal from '../Modal'

import "./login.scss"
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';

const Login = () => {
  const [errMsg, setErrMsg] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formHeight, setFormHeight] = useState(false);
  const [showRegInputs, setShowRegInputs] = useState(false);

  const renderFormType = () => {
    if (!showRegInputs) {
      return <SignIn setIsRegisterMode={setIsRegisterMode} setErrMsg={setErrMsg} setModalOpen={setModalOpen} />;
    } else {
      return <SignUp setIsRegisterMode={setIsRegisterMode} setErrMsg={setErrMsg} setModalOpen={setModalOpen} />
    }
  }

  useEffect(() => {
    formHeight && setFormHeight(0)

    setTimeout(() => {
      isRegisterMode ? setFormHeight('458px') : setFormHeight('384px')
      setShowRegInputs(showRegInputs => !showRegInputs)
    }, 700);

  }, [isRegisterMode])

  return (
    <>
      <div className="login-container" style={{ height: formHeight }}>
        <h2>{showRegInputs ? "AdminDash Register" : "AdminDash Auth"}</h2>
        {renderFormType()}
      </div>
      <div className="modal-container">
        <AnimatePresence
          initial={false}
          mode="wait"
          onExitComplete={() => null}
        >
          {modalOpen && <Modal text={errMsg} />}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Login