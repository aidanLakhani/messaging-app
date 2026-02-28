import { io } from "socket.io-client";

const URL =
  import.meta.env.SERVER ||
  (import.meta.env.PROD
    ? import.meta.env.VITE_API_URL
    : "http://" + window.location.hostname + ":5000");

export default (user) => {
  const socket = io(URL, {
    autoConnect: false,
    auth: {
      user: user,
    },
  });
  return socket;
};
