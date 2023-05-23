import React, { useCallback, useEffect, useState } from "react";
import { useTelegram } from "../../hooks/useTelegram";

import "./style.css";

export default function CreateOrder() {
  const [data, setData] = useState({
    price: "",
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
    if (!data.link) {
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
      <h3>Заполните поля </h3>
      <input
        name="price"
        className={"input"}
        type="text"
        placeholder={"Цена"}
        onChange={onChangedata}
      />

      <input
        name="quantity"
        className={"input"}
        type="number"
        placeholder={"Количество"}
        onChange={onChangedata}
      />
      <input
        name="link"
        className={"input"}
        type="text"
        placeholder={"Ссылка"}
        onChange={onChangedata}
      />
    </div>
  );
}
