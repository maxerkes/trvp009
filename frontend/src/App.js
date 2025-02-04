import Footer from "./components/Footer";
import Main from "./components/Main";
import Nav from "./components/Nav";
import Header from "./components/Header";
import { useState, useEffect } from "react";

export default function App() {
  const [shown, setShown] = useState(false);
  // State to store the current date
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <>
      {/* Render Header once with all required props */}
      <Header
        shown={shown}
        setShown={setShown}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <div className="app-main-container">
        <Main shown={shown} setShown={setShown} currentDate={currentDate} />
        <Nav />
      </div>
      <Footer />
    </>
  );
}
