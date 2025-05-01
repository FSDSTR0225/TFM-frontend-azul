import { Link } from "react-router-dom";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { FaAppStore, FaGooglePlay } from "react-icons/fa";
import "../style/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">Link2Play</div>
        <ul className="footer-links">
          <li>
            <Link to="/about">Sobre nosotros</Link>
          </li>
          <li>
            <Link to="/privacy">Términos y Privacidad</Link>
          </li>

          <li>
            <Link to="/contact">Contacto</Link>
          </li>
        </ul>
        <div className="footer-rrss">
          <FaInstagram /> <FaXTwitter /> <FaAppStore />
          <FaGooglePlay />
        </div>
        <p className="footer-copy">
          © 2025 Link2Play. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
