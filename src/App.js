import "./App.css";
import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { Route, Routes } from "react-router-dom";

import Header from "./components/Header/Header";
import CreateOrderPage from "./pages/CreateOrderPage/CreateOrderPage";
import UpdateOrderPage from "./pages/UpdateOrderPage/UpdateOrderPage";
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
        <Route path={"order"} element={<CreateOrderPage />} />
        <Route path={"order/:orderId"} element={<UpdateOrderPage />} />
        <Route path={"register"} element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
