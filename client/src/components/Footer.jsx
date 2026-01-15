function Footer() {
  return (
    <footer className="footer">
      <span className="footer__credit">
        © {new Date().getFullYear()} Aidan Lakhani
      </span>
      &nbsp;
      <a
        href="https://github.com/aidanLakhani/messaging-app"
        target="_blank"
        className="footer__link"
      >
        GitHub
      </a>
    </footer>
  );
}

export default Footer;
