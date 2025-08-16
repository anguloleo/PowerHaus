import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { HiOutlineUserCircle } from "react-icons/hi2";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { Link } from "react-router-dom";
import "./ProfileButton.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = `profile-button-dropdown ${showMenu ? "active" : ""}`;

  return (
    <div className="profile-button-container">
      <button onClick={toggleMenu}   className={`profile-icon-btn ${showMenu ? "active" : ""}`}
>
        <HiOutlineUserCircle size={34} />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li className="profile-name">Hi {user.firstName}!</li>

            {user.role === "member" && (
              <li>
                <Link to="/my-classes" onClick={closeMenu} className="profile-link">
                  My Classes
                </Link>
              </li>
            )}

            <li>
              <Link to="/repair-requests" onClick={closeMenu} className="profile-link">
                Repair Request
              </Link>
            </li>
            <li>
              <Link to="/my-classes" onClick={closeMenu} className="profile-link">
                My Classes
              </Link>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">Log Out</button>
            </li>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
