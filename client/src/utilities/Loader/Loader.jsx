import React from "react";

import "./Loader.scss";

const Loader = () => (
  <div className="overlay">
    <div className="overlay__background"></div>
    <div className="overlay__content">
      <span className="spinner"></span>
    </div>
  </div>
);

export default Loader;
