import React, { useCallback, useEffect, useState } from "react";
import { useTelegram } from "../../hooks/useTelegram";

import "./style.css";

const validDomains = ["detail.1688.com"];

export default function CreateOrder() {
  const [data, setData] = useState({
    quantity: "",
    link: null,
  });
  const [isValidLink, setIsValidLink] = useState(true);

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

  const isValidURL = (string) => {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    if (!pattern.test(string)) {
      return false;
    }
    const url = new URL(string);

    return validDomains.includes(url.hostname);
  };

  useEffect(() => {
    const isValid = isValidURL(data.link);

    setIsValidLink(data.link === null ? true : isValid);

    if (!isValid || !data.link || !data.quantity) {
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
      {!isValidLink && (
        <div className="error">
          <span>Неправильный формат ссылки</span>
        </div>
      )}
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
