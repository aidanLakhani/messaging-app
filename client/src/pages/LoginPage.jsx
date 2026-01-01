import "../sass/loginPage.scss";
import { useContext, useRef } from "react";
import { UserContext } from "../App";

function LoginPage() {
  const usernameRef = useRef(null);
  const { setUser } = useContext(UserContext);
  function handleClick() {
    if (usernameRef.current.value.trim().length > 0) {
      setUser(usernameRef.current.value);
    }
  }
  return (
    <>
      <h1 className="header">Login</h1>
      <div className="login-container">
        <input
          type="text"
          className="username-input"
          ref={usernameRef}
          placeholder="Enter username"
        />
        <button className="submit-btn" onClick={handleClick}>
          Login
        </button>
      </div>
    </>
  );
}

export default LoginPage;
