import React, { useCallback, useEffect, useState } from "react";
import { useTelegram } from "../../hooks/useTelegram";

import "./style.css";

export default function CreateOrder() {
  const [data, setData] = useState({ 
    quantity: "",
    link: "",
  });

  const { tg } = useTelegram();

  const onSendData = useCallback(() => {
    tg.sendData(JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onSendData);
    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [onSendData]);

  useEffect(() => {
    tg.MainButton.setParams({
      text: "Заказать",
    });
  }, []);

  useEffect(() => {
    tg.MainButton.show();
    if (!data.link || !data.quantity) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [data]);

  const onChangedata = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className={"form"}>
      <h3>Заполните все поля и нажмите кнопку отправить</h3>
      <input
        name="link"
        className={"input"}
        type="text"
        placeholder={"Ссылка*"}
        onChange={onChangedata}
      />
      <input
        name="quantity"
        className={"input"}
        type="number"
        placeholder={"Количество*"}
        onChange={onChangedata}
      />
    </div>
  );
}
