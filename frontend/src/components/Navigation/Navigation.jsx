import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

    return (
    <nav className="navigation-container">
      <ul className="navigation-list">
        <li>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/classes">Classes</NavLink>
          <NavLink to="/gyms">Gyms</NavLink>
        </li>
      </ul>
      {isLoaded && (
        <div className="profile-container">
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;