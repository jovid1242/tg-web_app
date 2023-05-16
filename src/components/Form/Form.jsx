import React, { useCallback, useEffect, useState } from "react";
import "./style.css";
import { useTelegram } from "../../hooks/useTelegram";

const Form = () => {
  const [client_name, setClient_name] = useState("");
  const [depozit, setDepozit] = useState("");
  const { tg } = useTelegram();

  const onSendData = useCallback(() => {
    const data = {
      client_name,
      depozit,
    };
    tg.sendData(JSON.stringify(data));
  }, [client_name, depozit]);

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onSendData);
    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [onSendData]);

  useEffect(() => {
    tg.MainButton.setParams({
      text: "Присоединиться в марафон",
    });
  }, []);

  useEffect(() => {
    if (!depozit || !client_name) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [client_name, depozit]);

  const onChangeClientName = (e) => {
    setClient_name(e.target.value);
  };

  const onChangeDepozit = (e) => {
    setDepozit(e.target.value);
  };

  return (
    <div className={"form"}>
      <h3>Введите ваши данные для участие в марафон</h3>
      <input
        className={"input"}
        type="text"
        placeholder={"Имя"}
        value={client_name}
        onChange={onChangeClientName}
      />
      <input
        className={"input"}
        type="number"
        placeholder={"Депозить"}
        value={depozit}
        onChange={onChangeDepozit}
      />
    </div>
  );
};

export default Form;
