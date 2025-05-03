import React, { useState, useEffect, useRef } from "react";
import "../styles/navbar.css"; // Import the CSS file
// import { CgProfile } from "react-icons/cg";
import { LuSettings } from "react-icons/lu";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">

  <div className="company-name">
   
      <Link className="company-name-link" to="/">
          DIALLOCK.AI
      </Link>
    
  </div>
      <div className="search-container1">
      <div className="search-wrapper">
        <IoIosSearch className="search-icon" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="search-input"
          aria-label="Search"
        />
      </div>
     </div>
      <div className="notifications">
        <button className="settings-button">
        <IoMdNotificationsOutline  className="settings-icon" />
        </button>
      </div>
      <div className="settings">
        <button className="settings-button">
        <LuSettings   className="settings-icon" />
        </button>
      </div>
      

      <div className="user-profile" >
        
        <IoPersonCircleOutline   className="user-photo" onClick={toggleDropdown} />
        {dropdownOpen && (
          <div className="dropdown-menu">
            <ul>
              <li>My Profile</li>
              <li>Settings</li>
              <li>Log Out</li>
            </ul>
          </div>
        )}
      </div>
    
    </nav>
  );
};

export default Navbar;
