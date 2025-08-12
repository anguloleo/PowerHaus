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
    .catch(
      async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  };

   // Demo Login 
  const demoLogin = (userCredential, userPassword) => {
    setCredential(userCredential);
    setPassword(userPassword);
    // Dispatch login after state update:
    // Because setState is async, wait a tick before dispatching login
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
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button type="submit">Log In</button>
      </form>

      <div className="demo-buttons" style={{ marginTop: '1rem' }}>
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
          style={{ marginLeft: '1rem' }}
        >
          Sign In as Member
        </button>
      </div>
    </>
  );
}

export default LoginFormModal;