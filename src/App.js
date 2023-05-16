import "./App.css";
import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import Header from "./components/Header/Header";
import Form from "./components/Form/Form";

const tg = window.Telegram.WebApp;

function App() {
  const { onToggleButton, tg } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <div className="App">
      <Header />
      <Form />
      {/* <button onClick={onToggleButton}>ToggleButton</button> */}
    </div>
  );
}

export default App;
