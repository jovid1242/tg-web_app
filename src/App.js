import React from "react";
import "./App.css";

const tg = window.Telegram.WebApp;

function App() {
  React.useEffect(() => {
    tg.ready();
  }, []);

  const onClose = () => {
    tg.close();
  };

  return (
    <div className="App">
      <h1>hiii</h1>
      <button>close</button>
    </div>
  );
}

export default App;
