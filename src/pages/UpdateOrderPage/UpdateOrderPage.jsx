import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTelegram } from "../../hooks/useTelegram";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";

import "./UpdateOrderPageStyles.css";

const API_URL = "http://localhost:9001/api";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function UpdateOrderPage() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);

  const { orderId } = useParams();
  const { tg } = useTelegram();

  const [details, setDetails] = useState([
    {
      id: uuidv4(),
      quantity: "",
      link: null,
      size: "",
      color: "",
      image: null,
      $new: true,
    },
  ]);

  const activeDetails = useMemo(
    () => details.filter((el) => !el?.$removed),
    [details]
  );
  const totalDetails = useMemo(() => activeDetails.length, [activeDetails]);

  const onSendData = useCallback(() => {
    tg.sendData(JSON.stringify(details));
  }, [details]);

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
    if (!details[0].link || !details[0].quantity) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [details]);

  const onChangedata = (e, detailId) => {
    let value = e.target.value;

    setDetails((prev) => {
      const detail = prev.find((el) => el.id === detailId);
      detail[e.target.name] = value;
      return [...prev];
    });
  };

  const handleAddDetailForm = () => {
    setDetails([
      ...details,
      {
        id: uuidv4(),
        quantity: "",
        link: null,
        size: "",
        color: "",
        image: null,
        $new: true,
      },
    ]);
    setActiveFormIndex(activeFormIndex + 1);
  };

  const handleRemoveDetailForm = (e) => {
    e.preventDefault();
    if (totalDetails <= 1) {
      return;
    }
    if (orderId) {
      setDetails((prev) => {
        const detail = prev[activeFormIndex - 1];
        detail.$removed = true;
        return [...prev];
      });
    } else {
      setDetails((prev) => [
        ...prev.filter((el, index) => index !== activeFormIndex - 1),
      ]);
    }

    setActiveFormIndex(activeFormIndex - 1);
  };

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

  const sendFileToApi = () => {
    const data = new FormData();

    details.forEach((elm, index) => {
      console.log('link==>>', elm.link);
      if (elm.link) {
        console.log('link=not=posibble==>>', elm.link);
        data.append(`[${index}].id`, elm.id);
        data.append(`[${index}].quantity`, elm.quantity);
        data.append(`[${index}].link`, elm.link);
        data.append(`[${index}].size`, elm.size);
        data.append(`[${index}].color`, elm.color);
        data.append(`[${index}].image`, elm.image);
        data.append(`[${index}].$new`, elm.$new);
        data.append(`[${index}].$removed`, elm.$removed);
      }
    });

    if (data.length) {
      axios.post(`${API_URL}/order`, data);
    }
  };

  useEffect(() => {
    if (orderId) {
      axios.get(`${API_URL}/order/${orderId}`).then((res) => {
        setDetails(res.data?.order?.OrderDetails);
      });
    }
  }, [orderId]);

  const handleChange = async ({ fileList: newFileList }, detailId) => {
    let previewImage = await getBase64(newFileList[0]?.originFileObj);

    if (newFileList[0]?.originFileObj) {
      setDetails((prev) => {
        const detail = prev.find((el) => el.id === detailId);
        detail.image = newFileList[0]?.originFileObj;
        detail.preview = previewImage;
        return [...prev];
      });
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Загрузить изображение
      </div>
    </div>
  );

  return (
    <div className="detail-form-container">
      {activeDetails?.map((detail, index) => {
        return (
          <div
            className={`detail-form fade ${
              index + 1 === activeFormIndex ? "active" : ""
            }`}
            key={`detail_key_${detail.id}`}
          >
            <h3>Заполните все поля и нажмите кнопку отправить</h3>
            <input
              name="link"
              className={"input"}
              type="text"
              placeholder={"Ссылка*"}
              onChange={(ev) => onChangedata(ev, detail.id)}
              value={detail.link || ""}
            />
            <input
              name="quantity"
              className={"input"}
              type="number"
              placeholder={"Количество*"}
              onChange={(ev) => onChangedata(ev, detail.id)}
              value={detail.quantity}
            />
            <div className="file_upload">
              {detail.preview ? (
                <img src={detail.preview} alt="image" />
              ) : detail.image ? (
                <img src={`${API_URL}/image/${detail.image}`} alt="image" />
              ) : null}
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                showUploadList={false}
                onChange={(ev) => handleChange(ev, detail.id)}
                maxCount={1}
              >
                {uploadButton}
              </Upload>
            </div>

            <input
              name="size"
              className={"input"}
              type="text"
              placeholder={"Размер*"}
              onChange={(ev) => onChangedata(ev, detail.id)}
              value={detail.size}
            />
            <input
              name="color"
              className={"input"}
              type="text"
              placeholder={"Цвет*"}
              onChange={(ev) => onChangedata(ev, detail.id)}
              value={detail.color}
            />
          </div>
        );
      })}

      <div className="detail-form-footer">
        <div>
          {totalDetails > 1 && (
            <button className="remove-btn" onClick={handleRemoveDetailForm}>
              Удалить
            </button>
          )}
        </div>
        <div className="actions">
          {activeFormIndex > 1 && (
            <button onClick={handlePrevDetailForm}>&laquo; Пред.</button>
          )}
          {activeFormIndex !== totalDetails && (
            <button onClick={handleNextDetailForm}>След. &raquo;</button>
          )}
          {activeFormIndex === totalDetails && (
            <button onClick={handleAddDetailForm}>+ Добавить</button>
          )}
        </div>
      </div>

      <button onClick={() => sendFileToApi()}>send data</button>
    </div>
  );
}
