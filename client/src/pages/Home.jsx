import { useEffect, useState, useRef, useContext } from "react";
import { socket } from "../utils/socket";
import { v4 as uuidv4 } from "uuid";
import LoadingPage from "./LoadingPage";
import { UserContext } from "../App";

function Home() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const inputBox = useRef(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setTimeout(() => {
      socket.connect();
    }, 500);
    function onConnect() {
      setIsConnected(true);
      console.log("connected");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("disconnected");
    }

    function onRecieve(message) {
      console.log("message received");
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

  async function handleSubmit(e) {
    let message = inputBox.current.value;
    inputBox.current.value = "";
    if (message.trim().length > 0) {
      var id = uuidv4();
      setMessages((x) => [{ message: message, user: user, id: id }, ...x]);
      sendMessage({ message: message, user: user, id: id });
    }
  }

  function sendMessage(message) {
    return socket.emit("send_message", message);
  }

  if (!isConnected) {
    return (
      <LoadingPage message="Waiting for server to start (can take a minute)" />
    );
  }

  return (
    <div>
      <h1>Messaging App</h1>
      <br></br>
      <div>
        <input
          placeholder="Enter your message"
          ref={inputBox}
          disabled={!isConnected}
          onKeyDown={(e) => {
            if (e.key == "Enter") handleSubmit(e);
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!isConnected}
          className="btn_submit"
        >
          Submit
        </button>
      </div>
      <br />
      <div className="messages-container">
        {[...messages].map((m) => (
          <div key={m.id} className="message">
            <span class="message__user">{m.user}:</span> {m.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
