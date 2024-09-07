import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import visa from "../assets/visa.png";
import paypal from "../assets/paypal.png";
import group from "../assets/group.png";

import "../Banner/banner.css";
import "../Style/style.css";
import "./footer.css";

const Footer = () => {
  return (
    <div className="container">
      <div className="banner-container-1">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div class="flex flex-col items-center justify-center min-h-screen bg-background text-foreground ">
            <h2 class="mb-4 text-lg font-medium">
              Subscribe to our newsletter
            </h2>
            <div style={{ width: "100%", height: "48px" }}>
              <div class="max-w-md">
                <form class="flex flex-col h-48">
                  <input
                    placeholder="Email"
                    type="email"
                    id="email"
                    name="email"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm md:text-base mb-4"
                    required
                  />

                  <button
                    type="submit"
                    class="bg-blue-500 w-full border border-gray-300 text-white py-2 px-4 rounded-md text-sm md:text-base"
                  >
                    <FontAwesomeIcon icon={faArrowRight} id="icon" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-footer">
        <div className="footer">
          <div className="country">
            <text>Country/region</text>
          </div>
          <div className="selection-text">
            <div className="selection-english">English (EN)</div>
            <FontAwesomeIcon icon={faChevronDown} />
          </div>
        </div>
        <div className="payment">
          <img src={visa} alt="visa" />
          <img src={paypal} alt="paypal" />
          <img src={group} alt="groud" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
