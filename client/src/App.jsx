import { Route, Routes } from "react-router-dom";
import "./sass/main.scss";
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { useState, useEffect } from "react";
import Footer from "./components/Footer.jsx";
import { UserContext } from "./UserContext.jsx";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : "";
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      console.log("set user");
    }
  }, [user]);

  return (
    <div className="wrapper">
      <Routes>
        <Route
          path="/"
          element={
            <UserContext.Provider value={{ user, setUser }}>
              {user ? <Home /> : <LoginPage />}
            </UserContext.Provider>
          }
        />
        <Route
          path="/login"
          element={
            <UserContext.Provider value={{ user, setUser }}>
              <LoginPage />
            </UserContext.Provider>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
