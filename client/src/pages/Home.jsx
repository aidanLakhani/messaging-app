import { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";
import { v4 as uuidv4 } from "uuid";
import LoadingPage from "./LoadingPage";

function Home() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const inputBox = useRef(null);

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
      console.log(message);
      // Check if own message (check last 5 to account for latency)
      setMessages((x) => {
        for (let i = 0; i < Math.min(5, x.length); i++) {
          if (message.id == x[i].id) {
            console.log("duplicate");
            console.log(x[i]);
            return x;
          }
        }

        return [{ message: message.message, id: message.id }, ...x];
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
    // Create own instance of message and ignore new ones with matching id
    // Can limit to last 50 messages, we will have rate limiting enabled anyway
    // Reset input box
    let message = inputBox.current.value;
    inputBox.current.value = "";
    if (message.trim().length > 0) {
      // Create own instance of message
      var id = uuidv4();
      setMessages((x) => [{ message: message, id: id }, ...x]);
      // Send message
      sendMessage({ message: message, id: id });
    }
  }

  function sendMessage(message) {
    return socket.emit("send_message", message);
  }

  if (!isConnected) {
    return <LoadingPage message="Connecting to server..." />;
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
      <div>
        {[...messages].map((x) => (
          <div key={x.id}>{x.message}</div>
        ))}
      </div>
    </div>
  );
}

export default Home;
