import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./sass/main.scss";
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { createContext, useState } from "react";

export const UserContext = createContext(null);
function App() {
  const [user, setUser] = useState("");
  return (
    <div className="Wrapper">
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
    </div>
  );
}

export default App;
