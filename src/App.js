import "./App.css";
import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { Route, Routes } from "react-router-dom";

import Header from "./components/Header/Header";
import Order from "./pages/Order";
import Register from "./pages/Register";

const tg = window.Telegram.WebApp;

function App() {
  const { tg } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path={"order"} element={<Order />} />
        <Route path={"register"} element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
