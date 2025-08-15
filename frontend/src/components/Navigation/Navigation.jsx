// src/components/Navigation.jsx
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navigation-container">
      <div className="nav-left">
        {/* Logo + Title */}
        <NavLink to="/" className="logo-section">
          <img
            src="https://lodgr.s3.us-east-2.amazonaws.com/PowerHaus+Logo.png" 
            alt="PowerHaus Logo"
            className="logo"
          />
          <span className="site-title">PowerHaus Gym</span>
        </NavLink>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/classes/all">Classes</NavLink>
          </li>
          <li>
            <NavLink to="/gyms">Gyms</NavLink>
          </li>
        </ul>
      </div>

      {/* Profile Button */}
      {isLoaded && (
        <div className="profile-container">
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
