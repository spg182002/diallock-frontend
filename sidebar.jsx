import React from "react";
import { NavLink } from "react-router-dom";  // ✅ Use NavLink for active state
import "../styles/sidebar.css"; 
import { BiNavigation } from "react-icons/bi";
import { IoPeople } from "react-icons/io5";
import { VscListFilter } from "react-icons/vsc";
import { MdOutlineEmail } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { LuSettings } from "react-icons/lu";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li>
          <NavLink className="sidebar-field" to="/" end>
            <IoPeople className="sidebar-field-icon" /> Leads List
          </NavLink>
        </li>
        <li>
          <NavLink className="sidebar-field" to="/create-campaign">
            <IoPerson className="sidebar-field-icon" /> Create Campaign
          </NavLink>
        </li>
        <li>
          <NavLink className="sidebar-field" to="/manage-campaign">
            <BiNavigation className="sidebar-field-icon" /> Manage Campaign
          </NavLink>
        </li>
        <li>
          <NavLink className="sidebar-field" to="/communications">
            <MdOutlineEmail className="sidebar-field-icon" /> Communications
          </NavLink>
        </li>
        <li>
          <NavLink className="sidebar-field" to="/settings">
            <LuSettings className="sidebar-field-icon" /> Settings
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
