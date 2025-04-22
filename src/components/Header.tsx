import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bank-header">
      <div className="header-container">
        <Link to="/" className="bank-logo">
  <i className="fas fa-university fa-2x"></i> 
  <span>Banco Digital</span>
</Link>
        
        {/* Menu para desktop */}
        <nav className="main-nav desktop-nav">
          <ul>
            <li><Link to="/">Clientes</Link></li>
            <li><Link to="/contas">Contas</Link></li>
            <li><Link to="/agencias">Agências</Link></li>
          </ul>
        </nav>
        
        {/* Ícone do menu mobile */}
        <button 
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        
        {/* Menu mobile */}
        <nav className={`main-nav mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Clientes</Link></li>
            <li><Link to="/contas" onClick={() => setMobileMenuOpen(false)}>Contas</Link></li>
            <li><Link to="/agencias" onClick={() => setMobileMenuOpen(false)}>Agências</Link></li>
          </ul>
        </nav>
        
        <div className="user-actions">
          <button className="btn-notifications">
            <i className="fas fa-bell"></i>
          </button>
          <div className="user-profile">
            <span>Admin</span>
          </div>
        </div>

        
      </div>
      
    </header>
  );
}