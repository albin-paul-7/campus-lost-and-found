import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <span className="brand-text">
              Campus<strong>Lost&Found</strong>
            </span>
          </div>
          <p className="footer-tagline">
            Connecting students and faculty to reunite lost valuables across university departments,
            libraries, classrooms, and cafeterias.
          </p>
          <div className="badge-tag">MERN Stack • ICTAK Guidelines</div>
        </div>

        <div className="footer-col links-col">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Browse All Items</Link></li>
            <li><Link to="/report">Report Lost Item</Link></li>
            <li><Link to="/report">Report Found Item</Link></li>
            <li><Link to="/my-items">My Reported Items</Link></li>
          </ul>
        </div>

        <div className="footer-col guidelines-col">
          <h4 className="footer-heading">Campus Guidelines</h4>
          <ul className="footer-tips">
            <li>Never post personal banking pins or identity credentials.</li>
            <li>Meet at campus security or public counters for verification.</li>
            <li>Always check serial numbers or distinct scratches when claiming.</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Campus Lost and Found Portal. Developed as per ICT Academy of Kerala (ICTAK) MERN Standards.</p>
      </div>
    </footer>
  );
};

export default Footer;
