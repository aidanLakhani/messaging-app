import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// const URL = "https://localhost:5000";
// const URL = "http://" + window.location.hostname + ":5000";
const URL = "https://messaging-app-0ts7.onrender.com";

export const socket = io(URL, {
  autoConnect: false,
});
