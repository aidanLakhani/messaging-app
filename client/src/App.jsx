import { Route, Routes } from "react-router-dom";
import "./sass/main.scss";
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { useState, useEffect } from "react";
import Footer from "./components/Footer.jsx";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : "";
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    console.log("set user");
  }, [user]);

  return (
    <div className="wrapper">
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Home user={user} setUser={setUser} />
            ) : (
              <LoginPage setUser={setUser} />
            )
          }
        />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
