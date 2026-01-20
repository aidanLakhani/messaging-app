import { useEffect, useState, useRef, useContext } from "react";
import { socket } from "../utils/socket";
import { v4 as uuidv4 } from "uuid";
import LoadingPage from "./LoadingPage";
import { UserContext } from "../UserContext.jsx";

function Home() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const inputBox = useRef(null);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    socket.connect();
    function onConnect() {
      setIsConnected(true);
      console.log("connected");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("disconnected");
    }

    function onRecieve(message) {
      if (!import.meta.env.PROD) console.log("message received");
      // Check if message sent by self (check last 5 to account for latency)
      setMessages((m) => {
        for (let i = 0; i < Math.min(5, m.length); i++) {
          if (message.id == m[i].id) {
            return m;
          }
        }

        return [
          { message: message.message, user: message.user, id: message.id },
          ...m,
        ];
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onRecieve);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onRecieve);
      socket.disconnect();
    };
  }, []);

  async function handleSubmit() {
    let message = inputBox.current.value;
    inputBox.current.value = "";
    if (message.trim().length > 0) {
      var id = uuidv4();
      setMessages((x) => [{ message: message, user: user, id: id }, ...x]);
      sendMessage({ message: message, user: user, id: id });
    }
  }

  function handleLogout() {
    setUser("");
  }

  function sendMessage(message) {
    return socket.emit("send_message", message);
  }

  if (!isConnected) {
    return (
      <LoadingPage message="Waiting for server to start (can take a minute)"></LoadingPage>
    );
  }

  return (
    <div className="app">
      <div className="header-container">
        <h1 className="header-container__title">Messaging App</h1>
        <button className="header-container__logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <br></br>
      <div className="message-container">
        <input
          autoFocus
          placeholder="Enter your message"
          className="message-container__input"
          ref={inputBox}
          disabled={!isConnected}
          onKeyDown={(e) => {
            if (e.key == "Enter") handleSubmit();
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!isConnected}
          className="message-container__button"
        >
          Submit
        </button>
      </div>
      <br />
      <div className="messages">
        {[...messages].map((m) => (
          <div key={m.id} className="messages__item">
            <span className="messages__user">{m.user}:</span> {m.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
