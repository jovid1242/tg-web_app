import React from "react";
import Button from "../Button/Button";
import { useTelegram } from "../../hooks/useTelegram";
import "./style.css";

const Header = () => {
  const { onClose } = useTelegram();

  return (
    <div className={"header"}>
      <Button style={{ fontWeight: 700 }} onClick={onClose}>
        Закрыть
      </Button>
      <span className={"logo"}>Chinahouse</span>
    </div>
  );
};

export default Header;
