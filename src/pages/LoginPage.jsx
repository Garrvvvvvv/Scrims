import React, { useEffect, useState } from "react";
import { auth } from "../firebase"; // Assuming firebase.js is correctly configured
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (user) {
      // Redirect to home or dashboard after successful login
      navigate("/");
    }
    if (error) {
      setLoginError(error.message);
    }
  }, [user, loading, error, navigate]);

  const handleGoogleLogin = async () => {
    setLoginError(""); // Clear previous errors
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Redirection handled by useEffect
    } catch (err) {
      console.error("Google login error:", err);
      setLoginError("Failed to log in with Google. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #e0f7fa 0%, #b2ebf2 25%, #80deea 50%, #4dd0e1 75%, #26c6da 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e0f7fa',
            borderTop: '4px solid #006064',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #e0f7fa',
            borderTop: '3px solid #00838f',
            borderRadius: '50%',
            animation: 'spin 1.5s linear infinite reverse'
          }}></div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e0f7fa',
            borderTop: '3px solid #0097a7',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
        </div>
        <h3 style={{
          fontSize: '1.5rem',
          color: '#006064',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          Loading Authentication...
        </h3>
        <p style={{
          fontSize: '1.1rem',
          color: '#00838f',
          margin: 0,
          opacity: 0.8
        }}>
          Please wait while we check your session.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #e0f7fa 0%, #b2ebf2 25%, #80deea 50%, #4dd0e1 75%, #26c6da 100%)',
      padding: '1.5rem',
      position: 'relative',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '@media (max-width: 768px)': {
        padding: '1rem',
      }
    }}>
      {/* Geometric background patterns */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {/* Hexagonal patterns */}
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '5%',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          animation: 'rotate 15s linear infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          animation: 'rotate 20s linear infinite reverse'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: '120px',
          height: '120px',
          background: 'linear-gradient(225deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          animation: 'rotate 25s linear infinite'
        }}></div>
        
        {/* Floating triangles */}
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '20%',
          width: '0',
          height: '0',
          borderLeft: '30px solid transparent',
          borderRight: '30px solid transparent',
          borderBottom: '52px solid rgba(255,255,255,0.1)',
          animation: 'float 8s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '30%',
          right: '5%',
          width: '0',
          height: '0',
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderBottom: '35px solid rgba(255,255,255,0.08)',
          animation: 'float 12s ease-in-out infinite reverse'
        }}></div>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '450px',
        width: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px rgba(0, 96, 100, 0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
        border: '1px solid rgba(255,255,255,0.3)',
        overflow: 'hidden',
        animation: 'fadeIn 0.6s ease-out',
        textAlign: 'center',
        '@media (max-width: 768px)': {
          padding: '2rem',
        },
        '@media (max-width: 480px)': {
          padding: '1.5rem',
        }
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #006064, #00838f, #0097a7, #00acc1)'
        }}></div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #006064, #00838f)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            letterSpacing: '0.02em',
            textShadow: '0 0 15px rgba(0, 96, 100, 0.2)',
            '@media (max-width: 768px)': {
              fontSize: '2rem',
            },
            '@media (max-width: 480px)': {
              fontSize: '1.8rem',
            }
          }}>
            Welcome Back!
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#00838f',
            marginTop: '0.5rem',
            opacity: 0.8
          }}>
            Sign in to access your admin portal.
          </p>
        </div>

        {loginError && (
          <div style={{
            color: '#dc2626',
            marginBottom: '1.5rem',
            padding: '1.2rem',
            background: 'linear-gradient(135deg, rgba(255,240,240,0.95), rgba(255,220,220,0.85))',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: '600',
            boxShadow: '0 8px 24px rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            ❌ {loginError}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            background: loading
              ? 'linear-gradient(135deg, #a0aec0, #718096)' // Gray for disabled
              : 'linear-gradient(135deg, #006064, #00838f)', // Blue for active
            color: 'white',
            fontWeight: 'bold',
            padding: '1rem 2rem',
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 10px 20px rgba(0, 96, 100, 0.3)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transform: 'scale(1)',
            transition: 'all 0.3s ease',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            width: '100%',
            maxWidth: '300px',
            margin: '0 auto',
            opacity: loading ? 0.7 : 1,
            '@media (max-width: 480px)': {
              padding: '0.8rem 1.5rem',
              fontSize: '1rem',
            }
          }}
          onMouseEnter={(e) => !e.target.disabled && (e.target.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <img src="/placeholder.svg?height=24&width=24" alt="Google logo" style={{ width: '24px', height: '24px' }} />
          <span>Login with Google</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
