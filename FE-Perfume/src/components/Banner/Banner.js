import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookMessenger } from "react-icons/fa";
import "./banner.css";
import banner from "../assets/banner.png";
import avt from "../assets/avt2.png";
const Banner = () => {
  return (
    <div className="mt-5">
      <div className="banner-container">
        <img className="banner img-fluid" src={banner} alt="" />
      </div>
      <div className="container perfume-section">
        <div className="row align-items-center">
          <div className="col-md-6 order-md-1">
            <img
              src={avt}
              alt="Perfume"
              className="img-fluid perfume-image"
              style={{ maxWidth: "100%" }}
            />
          </div>
          <div className="col-md-6 perfume-text order-md-2">
            <h1 className="display-5">LYNNE de R</h1>
            <h3>Perfume Creator</h3>
            <p className="lead">
              In love with fine perfumery, Lynne de R. was keen to create a
              “haute couture” perfumery. It is in Grasse, in her magnificent
              Parfumoir, that she welcomes you in a boudoir atmosphere to help
              you discover all the fragrances that make up her creations. Born
              from her passion for the city of flowers and perfumes, Eau de
              Grasse, an original reference, represents in a bottle all the art
              and history of artisanal perfumery since time immemorial.
            </p>
          </div>
        </div>
      </div>

      {/* Messenger Icon with Link */}
      <Link
        to="#"
        className="messenger-icon"
        onClick={() =>
          window.open(
            "https://www.facebook.com/messages/t/378396382032730",
            "_blank"
          )
        }
      >
        <FaFacebookMessenger />
      </Link>
    </div>
  );
};

export default Banner;
