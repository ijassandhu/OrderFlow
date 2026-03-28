import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Menu, X, BarChart2, Zap } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (e, targetId) => {
    if (location.pathname !== '/') return;
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled glass' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Package size={24} color="white" />
          </div>
          <span className="logo-text">Order<span className="text-gradient">Flow</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links">
          <a href="#features" onClick={(e) => handleScrollToSection(e, 'features')} className="nav-link">Features</a>
          <a href="#how-it-works" onClick={(e) => handleScrollToSection(e, 'how-it-works')} className="nav-link">How it Works</a>
          <Link to="/dashboard" className="nav-link">
            <BarChart2 size={16} />
            Dashboard
          </Link>
          <Link to="/dashboard" className="btn btn-primary">
            <Zap size={16} />
            Get Started
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="mobile-nav glass">
          <a href="#features" onClick={(e) => handleScrollToSection(e, 'features')} className="mobile-link">Features</a>
          <a href="#how-it-works" onClick={(e) => handleScrollToSection(e, 'how-it-works')} className="mobile-link">How it Works</a>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="mobile-link">Dashboard</Link>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary full-width">Get Started</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
