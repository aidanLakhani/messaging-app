import "../sass/loadingPage.scss";

const LoadingPage = ({ message = "Loading..." }) => (
  <div className="container" role="status" aria-live="polite">
    <div className="spinner" aria-hidden="true" />
    <div className="message">{message}</div>
  </div>
);

export default LoadingPage;
