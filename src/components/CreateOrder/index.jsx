import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import "./style.css";
import { useTelegram } from "../../hooks/useTelegram";

const validDomains = ["detail.1688.com", "qr.1688.com", "m.1688.com"];

export default function CreateOrder() {
  const [data, setData] = useState({
    quantity: "",
    link: null,
    size: "",
    color: "",
  });
  // const [isValidLink, setIsValidLink] = useState(true);
  const [details, setDetails] = useState({
    [uuidv4()]: {
      quantity: "",
      link: null,
      size: "",
      color: "",
    },
  });
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const totalDetails = useMemo(() => Object.keys(details).length, [details]);

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

    // setIsValidLink(data.link === null ? true : isValid);

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
    console.log("onchage", e.target.name, value, details[index]);

    setDetails((prev) => {
      prev[index][e.target.name] = value;
      return { ...prev };
    });
  };

  const handleAddDetailForm = () => {
    setDetails({
      ...details,
      [uuidv4()]: { quantity: "", link: null, size: "", color: "" },
    });
    setActiveFormIndex(activeFormIndex + 1);
  };

  const handleCreateOrder = () => {
    console.log("details", details);
  };

  const handleRemoveDetailForm = () => {};

  const handlePrevDetailForm = () => {
    if (activeFormIndex > 1) {
      setActiveFormIndex(activeFormIndex - 1);
    }
  };

  const handleNextDetailForm = () => {
    if (activeFormIndex < totalDetails) {
      setActiveFormIndex(activeFormIndex + 1);
    }
  };

  return (
    <div className="detail-form-container">
      {Object.keys(details).map((detailId, index) => (
        <div
          className={`detail-form fade ${
            index + 1 === activeFormIndex ? "active" : ""
          }`}
          key={`detail_key_${detailId}`}
        >
          {/* <h3>Заполните все поля и нажмите кнопку отправить</h3> */}
          <input
            name="link"
            className={"input"}
            type="text"
            placeholder={"Ссылка*"}
            onChange={(ev) => onChangedata(ev, detailId)}
            value={details[detailId].link || ""}
          />
          {/* {!isValidURL(details[detailId].link) && (
            <div className="error">
              <span>Неправильный формат ссылки</span>
            </div>
          )} */}
          <input
            name="quantity"
            className={"input"}
            type="number"
            placeholder={"Количество*"}
            onChange={(ev) => onChangedata(ev, detailId)}
            value={details[detailId].quantity}
          />
          <input
            name="size"
            className={"input"}
            type="text"
            placeholder={"Размер*"}
            onChange={(ev) => onChangedata(ev, detailId)}
            value={details[detailId].size}
          />
          <input
            name="color"
            className={"input"}
            type="text"
            placeholder={"Цвет*"}
            onChange={(ev) => onChangedata(ev, detailId)}
            value={details[detailId].color}
          />
        </div>
      ))}

      <div className="detail-form-footer">
        <div>
          {totalDetails > 1 && (
            <button onClick={handleRemoveDetailForm}>Remove</button>
          )}
        </div>
        <div className="actions">
          {activeFormIndex > 1 && (
            <button onClick={handlePrevDetailForm}>Prev</button>
          )}
          {activeFormIndex !== totalDetails && (
            <button onClick={handleNextDetailForm}>Next</button>
          )}
          {activeFormIndex === totalDetails && (
            <button onClick={handleAddDetailForm}>Add</button>
          )}
        </div>
      </div>

      <button onClick={handleCreateOrder}>Create</button>
    </div>
  );
}
