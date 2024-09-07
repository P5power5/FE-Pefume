// src/Header.js

import React, { useState } from "react";
import Logo from "../../image/logo.png"; // Make sure to replace this with the actual path to your logo image
// import "./Header.css"; // Import the custom CSS file

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <header>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "white" }}
      >
        <div className="container-fluid px-5">
          <a className="navbar-brand" href="#home">
            <img src={Logo} alt="Logo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav mx-auto">
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-center">
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="forWomenDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      For Women
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="forWomenDropdown"
                    >
                      <li>
                        <a className="dropdown-item" href="#lynne-de-r">
                          LYNNE DE R
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#eau-de-grasse-w">
                          EAU DE GRASSE
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#aqua-divina">
                          AQUA DIVINA
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#ete-indien">
                          ETE INDIEN
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#oudissimo">
                          OUDISSIMO
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#datsima">
                          DATSIMA
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#sakura">
                          SAKURA
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#white-blue">
                          WHITE BLUE
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#tendre-delit">
                          TENDRE DELIT
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#nemesis">
                          NEMESIS
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="forMenDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      For Men
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="forMenDropdown"
                    >
                      <li>
                        <a className="dropdown-item" href="#eau-de-grasse-m">
                          EAU DE GRASSE
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#rocky-in-the-sky">
                          ROCKY IN THE SKY
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#samourai-in-black">
                          SAMOURAI IN BLACK
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#violin-spirit">
                          VIOLIN SPIRIT
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#daoud">
                          DAOUD
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#dracula-elixir">
                          DRACULA ELIXIR
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#parsifal">
                          PARSIFAL
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#la-sierra">
                          LA SIERRA
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#crazy-delit">
                          CRAZY DELIT
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#soliflores">
                      Soliflores / Eau De Parfum
                    </a>
                  </li>
                </div>
                <div className="d-flex justify-content-center mt-2">
                  <li className="nav-item">
                    <a className="nav-link" href="#ambience-diffuser">
                      Ambience Diffuser
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#pillow-mist">
                      Pillow Mist
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#on-demand">
                      On Demand
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#contact">
                      Contact
                    </a>
                  </li>
                </div>
              </div>
            </div>
            {/* <div className="d-flex align-items-center">
              <FaSearch
                className="me-4"
                style={{ cursor: "pointer" }}
                onClick={toggleSearch}
              />
              <FaShoppingCart style={{ cursor: "pointer" }} />
            </div> */}
          </div>
        </div>
      </nav>
      {searchOpen && (
        <div
          className="search-container"
          style={{
            background: "#fff",
            padding: "10px",
            position: "absolute",
            top: "56px",
            width: "100%",
            zIndex: 1000,
          }}
        >
          <div className="container">
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
