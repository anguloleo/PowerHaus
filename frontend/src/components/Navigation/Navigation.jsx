
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import RepairRequestFormModal from "../RepairRequestFormModal";
import UserMetricsFormModal from "../UserMetricsFormModal";
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
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>

        {/* Quick Action Links */}
        {sessionUser && (
          <ul className="nav-actions">
              <li>
              <OpenModalButton
                buttonText="Add New Body Metrics"
                modalComponent={<UserMetricsFormModal />}
                className="orange-button"
              />
            </li>
            <li>
              <OpenModalButton
                buttonText="Add New Repair Request"
                modalComponent={<RepairRequestFormModal />}
                className="orange-button"
              />
            </li>
          </ul>
        )}
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
