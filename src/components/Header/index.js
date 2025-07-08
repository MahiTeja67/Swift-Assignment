import { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

class Header extends Component {
  render() {
    return (
      <header className="app-header">
        <div className="header-left">
          <Link to="/" className="swift-logo-link">
            <img
            className="swift-logo"
            alt="SWIFT"
            src="https://res.cloudinary.com/dy6va4nas/image/upload/v1751963559/Swift_logo_svg_kuuc93.svg"
            />
          </Link>
        </div>
        <div className="header-right">
          <Link to="/profile" className="user-profile-link">
            <div className="user-avatar">LG</div>
            <span className="user-name">Leanne Graham</span>
          </Link>
        </div>
      </header>
    )
  }
}

export default Header;