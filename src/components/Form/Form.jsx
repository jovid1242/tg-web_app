import React, { useCallback, useEffect, useState } from "react";
import "./style.css";
import { useTelegram } from "../../hooks/useTelegram";

const Form = () => {
  const [auth, setAuth] = useState({
    user_name: "",
    url: "",
    count: "",
    price: "",
  });

  const { tg } = useTelegram();

  const onSendData = useCallback(() => {
    tg.sendData(JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    tg.onEvent("mainButtonClicked", onSendData);
    return () => {
      tg.offEvent("mainButtonClicked", onSendData);
    };
  }, [onSendData]);

  useEffect(() => {
    tg.MainButton.setParams({
      text: "Оправить",
    });
  }, []);

  useEffect(() => {
    if (!auth.user_name || !auth.count || !auth.url || !auth.price) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [auth]);

  const onChangeAuth = (e) => {
    setAuth({ ...auth, [e.target.name]: e.target.value });
  };

  return (
    <div className={"form"}>
      <h3>Заполните поля </h3>
      <input
        name="user_name"
        className={"input"}
        type="text"
        placeholder={"ФИО"}
        onChange={onChangeAuth}
      />
      <input
        name="url"
        className={"input"}
        type="text"
        placeholder={"ССылка продукта"}
        onChange={onChangeAuth}
      />

      <input
        name="count"
        className={"input"}
        type="number"
        placeholder={"Количество товара"}
        onChange={onChangeAuth}
      />

      <input
        name="price"
        className={"input"}
        type="number"
        placeholder={"Цена товара"}
        onChange={onChangeAuth}
      />
    </div>
  );
};

export default Form;
