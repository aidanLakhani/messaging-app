import "../sass/loadingPage.scss";

const LoadingPage = ({ message = "Loading..." }) => (
  <div className="loading__container" role="status" aria-live="polite">
    <div className="loading__spinner" aria-hidden="true" />
    <div className="loading__message">{message}</div>
  </div>
);

export default LoadingPage;
