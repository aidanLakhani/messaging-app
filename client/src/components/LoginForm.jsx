import { useEffect, useRef } from "react";
import axios from "axios";

function Login({ setLoggedIn, loginType }) {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    var token = await axios.post("/api/login", {
      username: usernameRef.current.value,
      // Send hashed password instead for security
      password: passwordRef.current.value,
    });
    console.log(token);
    if (token.data.status == "success") {
      setLoggedIn(true);
    }
  };
  return (
    <section className="auth_form">
      <h1 className="auth-title">
        {/* Capitalize first letter of login type */}
        {String(loginType).charAt(0).toUpperCase() + String(loginType).slice(1)}
      </h1>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <label>
            <input type="text" placeholder="username" ref={usernameRef} />
          </label>
          <br />
          <label>
            <input type="password" placeholder="password" ref={passwordRef} />
          </label>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Login;
