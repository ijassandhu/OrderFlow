import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings, Zap, Shield, BarChart3, ArrowRight } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const features = [
    {
      icon: <Zap size={24} className="feature-icon" />,
      title: "Lightning Fast Processing",
      description: "Automate your order workflows and process thousands of orders per minute without breaking a sweat."
    },
    {
      icon: <BarChart3 size={24} className="feature-icon" />,
      title: "Real-time Analytics",
      description: "Gain actionable insights with our live dashboard. Track metrics, monitor urgency, and see trends instantly."
    },
    {
      icon: <Settings size={24} className="feature-icon" />,
      title: "Smart Automation Rules",
      description: "Configure custom routing and status logic based on inventory, order value, and priority."
    },
    {
      icon: <Shield size={24} className="feature-icon" />,
      title: "Enterprise Grade Security",
      description: "Your data is protected with bank-level encryption and secure role-based access control."
    }
  ];

  return (
    <div className="landing-wrap">
      {/* Hero Section */}
      <section className="hero-section container">
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Smarter <span className="text-gradient">Order</span> Processing for Modern Teams
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Automate your fulfillment workflow, manage inventory seamlessly, and gain real-time insights with our premium operations platform.
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Open Dashboard
              <ArrowRight size={18} />
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg glass">
              Explore Features
            </a>
          </motion.div>
        </div>
        
        {/* Abstract visual for hero */}
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="glass panel-preview">
            <div className="preview-header border-b">
              <div className="dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
            </div>
            <div className="preview-body">
              <div className="preview-row animate-pulse"></div>
              <div className="preview-row w-75 animate-pulse delay-100"></div>
              <div className="preview-row w-50 animate-pulse delay-200"></div>
            </div>
          </div>
          {/* Decorative blurs */}
          <div className="blur-blob brand-primary"></div>
          <div className="blur-blob brand-secondary"></div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section container section">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Everything you need to <span className="text-gradient-secondary">scale</span></h2>
          <p className="section-subtitle">Powerful tools wrapped in a stunning interface, designed to make your operations team faster and happier.</p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              className="glass-card feature-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Short CTA Section */}
      <section className="cta-section container section" id="how-it-works">
        <motion.div 
          className="glass-panel cta-box"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Ready to transform your operations?</h2>
          <p>Join thousands of businesses that trust OrderFlow for their core processing.</p>
          <Link to="/dashboard" className="btn btn-primary btn-lg mt-6">
            Get Started Now
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
