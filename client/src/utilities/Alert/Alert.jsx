import React from "react";

import "./Alert.scss";

function Alert({ message }) {
  return <p className="alert">{message}</p>;
}

export default Alert;
