import React from "react";
import Button from "../Button/Button";
// import { useTelegram } from "../../hooks/useTelegram";
import "./style.css";

const tg = window.Telegram.WebApp;

const Header = () => {
  const onClose = () => {
    tg.close();
  };

  return (
    <div className={"header"}>
      <Button onClick={onClose}>Закрыть</Button>
      <span className={"username"}>{tg.initDateUnsafe?.user?.username}</span>
    </div>
  );
};

export default Header;
