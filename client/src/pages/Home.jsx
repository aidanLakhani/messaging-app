import { useEffect, useState, useRef } from "react";
import { socket } from "../utils/socket";
import { v4 as uuidv4 } from "uuid";

function Home() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const inputBox = useRef(null);

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
      console.log("message received");
      console.log(message);
      // Check if message is duplicated (check only last 10 for efficiency)
      setMessages((x) => {
        for (let i = 0; i < x.length; i++) {
          if (message.id == x[i].id) {
            console.log("duplicate");
            console.log(x[i]);
            return x;
          }
        }

        return [...x, { message: message.message, id: message.id }];
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
    let message = inputBox.current.value;
    if (message.trim().length > 0) {
      // Reset input box
      inputBox.current.value = "";
      // Create own instance of message
      var id = uuidv4();
      setMessages((x) => [...x, { message: message, id: id }]);
      // Send message
      sendMessage({ message: message, id: id });
    }
  }

  function sendMessage(message) {
    return socket.emit("send_message", message);
  }

  return (
    <div>
      <h1>Messaging App</h1>
      <br></br>
      <div>
        <input placeholder="Enter your message" ref={inputBox} />
        <button onClick={handleSubmit} className="btn_submit">
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
