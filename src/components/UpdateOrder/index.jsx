import React, { useCallback, useEffect, useState } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import { useParams } from "react-router-dom";

import "./style.css";

const validDomains = ["detail.1688.com", "qr.1688.com", "m.1688.com"];

export default function CreateOrder() {
  const [data, setData] = useState({
    quantity: "",
    link: null,
    size: "",
    color: "",
  });
  const [isValidLink, setIsValidLink] = useState(true);
  const [details, setDetails] = useState([
    {
      quantity: "",
      link: null,
      size: "",
      color: "",
    },
  ]);
  const [activeFormIndex, setActiveFormIndex] = useState(0);

  const { id } = useParams();
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
    try {
      const url = new URL(string);
      return validDomains.includes(url.hostname);
    } catch (error) {
      return false;
    }
  };

  const urlify = (text) => {
    var urlRegex =
      /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/g;
    return String(text).match(urlRegex);
  };

  useEffect(() => {
    let isValid = isValidURL(data.link);

    setIsValidLink(data.link === null ? true : isValid);

    if (!isValid || !data.link || !data.quantity) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [data]);

  const onChangedata = (e, index) => {
    let value = e.target.value;
    if (e.target.name === "link" && !isValidURL(value)) {
      const splitedUrl = urlify(value)?.[0];
      value = isValidURL(splitedUrl) ? splitedUrl : value;
    }
    // setData({ ...data, [e.target.name]: value });
    setDetails((prev) => {
      prev[index][e.target.name] = value;
      return prev;
    });
  };

  const handleAddDetailForm = () => {
    setDetails((prev) => [
      ...prev,
      { quantity: "", link: null, size: "", color: "" },
    ]);
    const index = activeFormIndex + 1;
    setActiveFormIndex(index);
  };

  const handleCreateOrder = () => {
    console.log("details", details);
  };

  return (
    <div className="form-container">
      {details.map((detail, index) => (
        <div
          className={`form fade ${index === activeFormIndex ? "active" : ""}`}
          key={`detail_key_${index}`}
        >
          {/* <h3>Заполните все поля и нажмите кнопку отправить</h3> */}
          <input
            name="link"
            className={"input"}
            type="text"
            placeholder={"Ссылка*"}
            onChange={(ev) => onChangedata(ev, index)}
            value={detail.link || ""}
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
            onChange={(ev) => onChangedata(ev, index)}
            value={detail.quantity}
          />
          <input
            name="size"
            className={"input"}
            type="text"
            placeholder={"Размер*"}
            onChange={(ev) => onChangedata(ev, index)}
            value={detail.size}
          />
          <input
            name="color"
            className={"input"}
            type="text"
            placeholder={"Цвет*"}
            onChange={(ev) => onChangedata(ev, index)}
            value={detail.color}
          />
        </div>
      ))}

      <button onClick={handleAddDetailForm}>Add</button>
      <button onClick={handleCreateOrder}>Create</button>
    </div>
  );
}
