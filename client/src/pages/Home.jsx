import { useEffect, useState, useRef } from "react";
import io from "../utils/socket";
import { v4 as uuidv4 } from "uuid";
import LoadingPage from "./LoadingPage";

function Home({ user, setUser }) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const inputBox = useRef(null);
  const colorRef = useRef(null);
  const socket = useRef(io(user));

  useEffect(() => {
    const curSock = socket.current;
    curSock.connect();
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
          {
            message: message.message,
            user: message.user,
            color: message.color,
            id: message.id,
          },
          ...m,
        ];
      });
    }

    function onUserChange(newusers) {
      setUsers(newusers);
    }

    curSock.on("connect", onConnect);
    curSock.on("disconnect", onDisconnect);
    curSock.on("message", onRecieve);
    curSock.on("user_change", onUserChange);

    return () => {
      curSock.off("connect", onConnect);
      curSock.off("disconnect", onDisconnect);
      curSock.off("message", onRecieve);
      curSock.off("user_change", onUserChange);
      curSock.disconnect();
    };
  }, []);

  async function handleSubmit() {
    let message = inputBox.current.value;
    inputBox.current.value = "";
    if (message.trim().length > 0) {
      var id = uuidv4();
      setMessages((x) => [
        {
          message: message,
          user: user,
          color: colorRef.current.value,
          id: id,
        },
        ...x,
      ]);
      sendMessage({
        message: message,
        user: user,
        color: colorRef.current.value,
        id: id,
      });
    }
  }

  function handleLogout() {
    setUser("");
  }

  function sendMessage(message) {
    return socket.current.emit("send_message", message);
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
      <div className="main-content">
        <div className="chat-container">
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
            <input
              type="color"
              className="message-container__color"
              ref={colorRef}
              defaultValue="#333333"
            />
          </div>
          <div className="messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className="messages__item"
                style={{ color: m.color }}
              >
                <span className="messages__user">{m.user}:</span> {m.message}
              </div>
            ))}
          </div>
        </div>
        <div className="chats">
          <ul className="chats__list">
            {users.map((u) =>
              u.replace(/"/g, "") != user ? (
                <li className="chats__item">
                  <span className="chats__item-name">
                    {u.replace(/"/g, "")}
                  </span>
                </li>
              ) : null,
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
