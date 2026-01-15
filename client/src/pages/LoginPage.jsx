import "../sass/loginPage.scss";
import { useContext, useRef, useEffect } from "react";
import { UserContext } from "../UserContext.jsx";

function LoginPage() {
  const usernameRef = useRef(null);
  const { setUser } = useContext(UserContext);
  function handleSubmit() {
    if (usernameRef.current.value.trim().length > 0) {
      setUser(usernameRef.current.value);
    }
  }

  return (
    <>
      <h1 className="login-header">Login</h1>
      <div className="login-container">
        <input
          autoFocus
          type="text"
          className="username-input"
          ref={usernameRef}
          placeholder="Enter username"
          onKeyDown={(e) => {
            if (e.key == "Enter") handleSubmit();
          }}
        />
        <button className="submit-btn" onClick={handleSubmit}>
          Login
        </button>
      </div>
    </>
  );
}

export default LoginPage;
