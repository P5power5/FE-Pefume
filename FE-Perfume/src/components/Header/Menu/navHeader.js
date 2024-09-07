// src/components/NavHeader.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./Style/menu.css";
import {
  faMagnifyingGlass,
  faBagShopping,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const NavHeader = () => {
  return (
    <div className="content-top-menu">
      <nav className="menu-top-header">
        <ul id="list-menu1">
          <li>
          <Link to={'/ambience-difuser'}>For Women</Link>
            <FontAwesomeIcon icon={faChevronDown} />
          </li>
          <li>
          <Link to={'/ambience-difuser'}>For Men</Link>
            <FontAwesomeIcon icon={faChevronDown} />
          </li>
          <li>
            <Link to={'/soliflores'}>Soliflores / Eau De Parfum</Link>
          </li>
        </ul>
      </nav>
      <nav className="menu-bottom-header">
        <ul id="list-menu2">
          <li>
            <Link to={'/ambience-difuser'}>Ambience Difuser </Link>
          </li>
          <li>
            <Link to={'/pillow-mist'}>Pillow Mist</Link>
          </li>
          <li>
            <Link to={'/ondemand'}>On Demand</Link>
          </li>
          <li>
            <Link to={'/contact'}>Contact</Link>
          </li>
        </ul>
        <ul id="list-menu3">
          <li>
            <a>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </a>
          </li>
          <li>
            <a>
              <FontAwesomeIcon icon={faBagShopping} />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavHeader;
