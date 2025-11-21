"use client";
import { useState } from "react";
import api from "../../utils/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// ✅ ADDED: Password validation function
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: [
      password.length >= minLength ? null : "At least 8 characters",
      hasUpperCase ? null : "One uppercase letter",
      hasLowerCase ? null : "One lowercase letter", 
      hasNumbers ? null : "One number",
      hasSpecialChar ? null : "One special character (recommended)"
    ].filter(Boolean)
  };
};

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  // ✅ ADDED: Password errors state
  const [passwordErrors, setPasswordErrors] = useState([]);
  const router = useRouter();

  // ✅ ADDED: Password change handler
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    const validation = validatePassword(e.target.value);
    setPasswordErrors(validation.errors);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/users/login/", { username, password });
      Cookies.set("access_token", res.data.access);
      router.push("/");
    } catch (err) {
      alert("Login failed! Check username/password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // ✅ ADDED: Password validation before signup
    const validation = validatePassword(password);
    if (!validation.isValid) {
      alert("Please fix password errors before signing up.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/users/signup/", { username, email, password });
      alert("Account created! Please Sign In.");
      setActiveTab("login");
    } catch (err) {
      alert("Signup failed. Try a different username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Panel (Blue Design) - EXACTLY THE SAME */}
        <div className="left-panel">
          <div className="brand">
            <h1>AI Vision Platform</h1>
            <p>Advanced object detection and intelligent analysis powered by state-of-the-art machine learning models</p>
          </div>

          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path></svg>
              </div>
              <div className="feature-content">
                <h3>YOLO Object Detection</h3>
                <p>Real-time object detection with industry-leading accuracy</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>
              </div>
              <div className="feature-content">
                <h3>AI-Powered Q&A</h3>
                <p>Ask questions about detected objects using Gemini AI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel (Forms) - WITH MINIMAL ADDITIONS */}
        <div className="right-panel">
          <div className="auth-header">
            <h2>{activeTab === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{activeTab === 'login' ? 'Enter your credentials to access your account' : 'Sign up to start analyzing images'}</p>
          </div>

          {/* Tab Buttons - EXACTLY THE SAME */}
          <div className="tab-container">
            <button 
              className={`tab ${activeTab === 'login' ? 'active' : ''}`} 
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </button>
            <button 
              className={`tab ${activeTab === 'signup' ? 'active' : ''}`} 
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form - WITH PASSWORD VALIDATION ADDED */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input 
                    className="auth-input" 
                    type="text" 
                    placeholder="Enter username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
                  <input 
                    className="auth-input" 
                    type="password" 
                    placeholder="Enter password" 
                    value={password}
                    onChange={handlePasswordChange} // ✅ CHANGED: Using new handler
                    required 
                  />
                </div>
                {/* ✅ ADDED: Password error display for login */}
                {passwordErrors.length > 0 && activeTab === 'login' && (
                  <div className="password-errors">
                    {passwordErrors.map((error, index) => (
                      <div key={index} className="error-text">• {error}</div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          )}

          {/* Signup Form - WITH PASSWORD VALIDATION ADDED */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  <input 
                    className="auth-input" 
                    type="text" 
                    placeholder="Choose a username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <input 
                    className="auth-input" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg>
                  <input 
                    className="auth-input" 
                    type="password" 
                    placeholder="Create a password" 
                    value={password}
                    onChange={handlePasswordChange} // ✅ CHANGED: Using new handler
                    required 
                  />
                </div>
                {/* ✅ ADDED: Password error display for signup */}
                {passwordErrors.length > 0 && activeTab === 'signup' && (
                  <div className="password-errors">
                    {passwordErrors.map((error, index) => (
                      <div key={index} className="error-text">• {error}</div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="submit-btn" disabled={loading || passwordErrors.length > 0}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}