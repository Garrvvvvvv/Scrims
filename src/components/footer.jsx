"use client"

import React from 'react';
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react'; // Importing social icons

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,248,255,0.85))',
      backdropFilter: 'blur(15px)',
      borderRadius: '24px 24px 0 0',
      padding: '3rem 2rem',
      marginTop: '4rem',
      boxShadow: '0 -20px 40px rgba(0, 96, 100, 0.18), inset 0 -1px 0 rgba(255,255,255,0.7)',
      borderTop: '1px solid rgba(255,255,255,0.4)',
      color: '#006064',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2.5rem',
      textAlign: 'center',
    }}>
      {/* Top gradient line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #00acc1, #0097a7, #00838f, #006064)'
      }}></div>

      {/* Subtle background patterns */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -1,
      }}>
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(45deg, rgba(0,151,167,0.05), rgba(0,131,143,0.02))',
          borderRadius: '50%',
          animation: 'pulse-small 4s ease-in-out infinite alternate'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, rgba(0,96,100,0.05), rgba(0,131,143,0.02))',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          animation: 'rotate-slow 20s linear infinite'
        }}></div>
      </div>

      {/* Logo and Brand Name */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <img
          src="/placeholder.svg?height=80&width=80"
          alt="Your Event Logo"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            boxShadow: '0 8px 20px rgba(0, 96, 100, 0.2)',
            border: '2px solid rgba(0, 131, 143, 0.3)',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <h3 style={{
          fontSize: '2.2rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #006064, #00838f, #0097a7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          letterSpacing: '0.05em',
          textShadow: '0 0 15px rgba(0, 96, 100, 0.2)',
        }}>
          EVENT NAME
        </h3>
      </div>

      {/* Social Handles */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <a
          href="#"
          aria-label="Twitter"
          style={{
            color: '#00838f',
            transition: 'transform 0.2s ease, color 0.2s ease',
            // Note: Inline style for hover is not directly supported in React.
            // For actual hover effects, you'd typically use CSS classes or a state-based approach.
            // The onMouseEnter/onMouseLeave handlers below provide the interactive effect.
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
            e.currentTarget.style.color = '#00acc1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.color = '#00838f';
          }}
        >
          <Twitter size={32} />
        </a>
        <a
          href="#"
          aria-label="LinkedIn"
          style={{
            color: '#00838f',
            transition: 'transform 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
            e.currentTarget.style.color = '#00acc1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.color = '#00838f';
          }}
        >
          <Linkedin size={32} />
        </a>
        <a
          href="#"
          aria-label="Instagram"
          style={{
            color: '#00838f',
            transition: 'transform 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
            e.currentTarget.style.color = '#00acc1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.color = '#00838f';
          }}
        >
          <Instagram size={32} />
        </a>
        <a
          href="#"
          aria-label="GitHub"
          style={{
            color: '#00838f',
            transition: 'transform 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)';
            e.currentTarget.style.color = '#00acc1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.color = '#00838f';
          }}
        >
          <Github size={32} />
        </a>
      </div>

      {/* Team Names / Credits */}
      <div style={{
        fontSize: '0.9rem',
        color: '#00838f',
        opacity: 0.9,
        lineHeight: '1.6',
        maxWidth: '600px',
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
          Developed by:
        </p>
        <p style={{ margin: 0 }}>
          [Team Member 1 Name], [Team Member 2 Name], [Team Member 3 Name]
        </p>
        <p style={{ margin: '1rem 0 0 0', fontSize: '0.85rem', opacity: 0.7 }}>
          Special thanks to our community and contributors for their support.
        </p>
      </div>

      {/* Copyright */}
      <p style={{
        margin: 0,
        fontSize: '0.85rem',
        color: '#006064',
        opacity: 0.7,
        marginTop: '1.5rem',
      }}>
        &copy; {new Date().getFullYear()} Your Event Name. All rights reserved.
      </p>

      <style jsx>{`
        @keyframes pulse-small {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
