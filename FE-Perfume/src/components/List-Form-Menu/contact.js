import React, { Component } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./Style/contact.css";

export default class Contact extends Component {
  render() {
    return (
      <>
        <Header />
        {/* <div className="container">
          <div className="row">
            <h1>Contact</h1>
          </div>
          <div className="row">
            <div className="row">
              <div className="form-floating mb-3 mt-3 col col-md-6">
                <input
                  type="text"
                  className="form-control"
                  id="Name"
                  placeholder="Enter email"
                  name="Name"
                />
                <label htmlFor="Name">Name</label>
              </div>

              <div className="form-floating mt-3 mb-3 col col-md-6">
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  name="email"
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>

            <div className="row">
              <div className="form-floating col mb-3 mt-3">
                <input
                  type="text"
                  className="form-control"
                  id="number"
                  placeholder="Enter number"
                  name="number"
                />
                <label htmlFor="number">Number</label>
              </div>
            </div>

            <div className="form-floating row mt-3 mb-3">
              <input
                type="text"
                className="form-control"
                id="pwd"
                placeholder="Enter password"
                name="pswd"
              />
              <label htmlFor="pwd">Comment</label>
            </div>
          </div>
        </div> */}
        <div class="contact-form-container d-flex flex-column">
          <h1>Contact</h1>
          <form class="contact-form" style={{ border: "none" }}>
            <div class="mb-3 row">
              <div class="col">
                <label for="name" class="form-label">
                  Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  placeholder="Your Name"
                />
              </div>
              <div class="col">
                <label for="email" class="form-label">
                  Email
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder="Your Email"
                  required
                />
              </div>
            </div>
            <div class="mb-3 row">
              <div class="col">
                <label for="telephone" class="form-label">
                  Telephone
                </label>
                <input
                  type="tel"
                  class="form-control"
                  id="telephone"
                  placeholder="Your Telephone Number"
                />
              </div>
            </div>
            <div class="mb-3">
              <label for="comment" class="form-label">
                Comment
              </label>
              <textarea
                class="form-control"
                id="comment"
                rows="3"
                placeholder="Your Comment"
              ></textarea>
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-send">
                Send
              </button>
            </div>
          </form>
        </div>

        <Footer />
      </>
    );
  }
}
