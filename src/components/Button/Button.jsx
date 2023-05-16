import React from "react";
import "./style.css";

const Button = (props) => {
  return <button {...props} className={"button " + props.className} />;
};

export default Button;
