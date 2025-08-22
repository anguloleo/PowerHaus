import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginFormModal.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  };

  const demoLogin = (userCredential, userPassword) => {
    setCredential(userCredential);
    setPassword(userPassword);
    setTimeout(() => {
      dispatch(sessionActions.login({ credential: userCredential, password: userPassword }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) setErrors(data.errors);
        });
    }, 0);
  };

  return (
    <div className="modal-content login-modal">
      <button className="close-btn" onClick={closeModal}>&times;</button>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Enter username or email"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </label>
        {errors.credential && <p className="error">{errors.credential}</p>}
        <button type="submit" className="login-btn">Log In</button>
      </form>

      <div className="demo-buttons">
        <button
          type="button"
          onClick={() => demoLogin('Demolition', 'password')}
          className="demo-login-button"
        >
          Sign In as Admin
        </button>
        <button
          type="button"
          onClick={() => demoLogin('SlowMoQueen', 'napmaster1')}
          className="demo-login-button"
        >
          Sign In as Member
        </button>
      </div>
    </div>
  );
}

export default LoginFormModal;
