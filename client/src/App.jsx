import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./sass/main.scss";
import Home from "./pages/Home";
import LoginForm from "./components/LoginForm";
import Cookies from "js-cookie";
import { useState } from "react";
import AuthPage from "./pages/AuthPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(Cookies.get("loggedIn"));
  return (
    <div className="Wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<LoginForm setLoggedIn={setLoggedIn} loginType={"login"} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
