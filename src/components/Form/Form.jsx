import React, { useCallback, useEffect, useState } from "react";
import "./style.css";
import { useTelegram } from "../../hooks/useTelegram";

const Form = () => {
  const [auth, setAuth] = useState({
    user_name: "",
    surname: "",
    phone: "",
    address: "",
  });

  const { tg } = useTelegram();

  const onSendData = useCallback(() => {
    const data = {
      name: auth.user_name,
      surname: auth.surname,
      phone: auth.phone,
      address: auth.address,
    };
    tg.sendData(JSON.stringify(data));
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
        placeholder={"Имя"}
        onChange={onChangeAuth}
      />
      <input
        name="surname"
        className={"input"}
        type="text"
        placeholder={"Фамилия"}
        onChange={onChangeAuth}
      />

      <input
        name="phone"
        className={"input"}
        type="number"
        placeholder={"Номер телефон"}
        onChange={onChangeAuth}
      />

      <input
        name="address"
        className={"input"}
        type="text"
        placeholder={"Адресс"}
        onChange={onChangeAuth}
      />
    </div>
  );
};

export default Form;
