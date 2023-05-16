import React from "react";
import Button from "../Button/Button";
import { useTelegram } from "../../hooks/useTelegram";
import "./style.css";

const Header = () => {
  const { user, onClose , chat } = useTelegram();

  return (
    <div className={"header"}>
      <Button onClick={onClose}>Закрыть</Button>
      <span className={"username"}>{user?.username}</span>
      {JSON.stringify(chat)}
    </div>
  );
};

export default Header;
