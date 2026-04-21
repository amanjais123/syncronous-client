import { useFileHandler, useInputValidation } from "6pp";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

// SVG Icons
const EyeIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

const CameraIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);

const UserIcon = () => (
  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  const avatar = useFileHandler("single");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing in...");
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        { username: username.value, password: password.value },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating account...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    try {
      const { data } = await axios.post(`${server}/api/v1/user/new`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Hero Panel — hidden on mobile */}
      <div className="auth-hero">
        <div className="auth-hero-logo">
          <div className="auth-hero-logo-mark">
            <svg width="22" height="22" viewBox="0 0 78 32" fill="none">
              <path d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z" fill="rgba(255,255,255,0.9)" />
              <path d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z" fill="rgba(255,255,255,0.65)" />
              <path d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z" fill="rgba(255,255,255,0.4)" />
            </svg>
          </div>
          <span style={{ fontSize: "1.125rem", fontWeight: 700 }}>Syncronous</span>
        </div>

        <h1 className="auth-hero-title">
          The Future of<br />Team Conversations
        </h1>
        <p className="auth-hero-subtitle">
          Experience real-time messaging designed for the modern era — fluid, intelligent, and beautifully crafted.
        </p>

        <div className="auth-features">
          <div className="auth-feature-item">
            <div className="auth-feature-icon">⚡</div>
            <div className="auth-feature-text">
              <h4>Real-Time Sync</h4>
              <p>Messages delivered instantly across all your devices.</p>
            </div>
          </div>
          <div className="auth-feature-item">
            <div className="auth-feature-icon">🔒</div>
            <div className="auth-feature-text">
              <h4>End-to-End Encrypted</h4>
              <p>Every message protected with military-grade encryption.</p>
            </div>
          </div>
          <div className="auth-feature-item">
            <div className="auth-feature-icon">🌊</div>
            <div className="auth-feature-text">
              <h4>Fluid Exchange</h4>
              <p>Conversations that flow as naturally as your thoughts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-header">
          {/* Mobile logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            <div style={{
              width: 32, height: 32,
              background: "linear-gradient(135deg, #4648d4, #6063ee)",
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <svg width="16" height="16" viewBox="0 0 78 32" fill="none">
                <path d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z" fill="white" />
                <path d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z" fill="rgba(255,255,255,0.7)" />
                <path d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z" fill="rgba(255,255,255,0.45)" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: "1rem", color: "#131b2e" }}>Syncronous</span>
          </div>

          <h2>{isLogin ? "Welcome back" : "Create an account"}</h2>
          <p>{isLogin ? "Continue your journey with Syncronous." : "Join thousands of teams already using Syncronous."}</p>
        </div>

        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          {/* Avatar Upload (Signup only) */}
          {!isLogin && (
            <div className="auth-avatar-upload">
              <label className="auth-avatar-ring" htmlFor="avatar-input" title="Upload photo">
                <div className="auth-avatar-img">
                  {avatar.preview ? (
                    <img src={avatar.preview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#eaedff", color: "#4648d4" }}>
                      <UserIcon />
                    </div>
                  )}
                </div>
                <div className="auth-avatar-overlay">
                  <CameraIcon />
                </div>
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={avatar.changeHandler}
                style={{ display: "none" }}
              />
              <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#464554" }}>Tap to upload photo</p>
              {avatar.error && (
                <p style={{ color: "#ba1a1a", fontSize: "0.75rem", marginTop: "0.25rem" }}>{avatar.error}</p>
              )}
            </div>
          )}

          {/* Name (Signup) */}
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="name-input">Full Name</label>
              <input
                id="name-input"
                className="auth-input"
                type="text"
                placeholder="Alex Rivera"
                value={name.value}
                onChange={name.changeHandler}
                required
              />
            </div>
          )}

          {/* Bio (Signup) */}
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="bio-input">Bio</label>
              <input
                id="bio-input"
                className="auth-input"
                type="text"
                placeholder="Tell us a bit about yourself..."
                value={bio.value}
                onChange={bio.changeHandler}
                required
              />
            </div>
          )}

          {/* Username */}
          <div className="auth-field">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              className="auth-input"
              type="text"
              placeholder="your.username"
              value={username.value}
              onChange={username.changeHandler}
              required
            />
            {username.error && (
              <p style={{ color: "#ba1a1a", fontSize: "0.75rem", marginTop: "0.25rem" }}>{username.error}</p>
            )}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label htmlFor="password-input">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password-input"
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password.value}
                onChange={password.changeHandler}
                required
                style={{ paddingRight: "3rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#464554", display: "flex"
                }}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div style={{ textAlign: "right", marginBottom: "0.75rem" }}>
              <button type="button" className="auth-btn-text" style={{ fontSize: "0.875rem" }}>Forgot password?</button>
            </div>
          )}

          <button
            id={isLogin ? "login-submit-btn" : "signup-submit-btn"}
            type="submit"
            className="auth-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>

          <div className="auth-switch">
            {isLogin ? "New to the platform? " : "Already have an account? "}
            <button type="button" className="auth-btn-text" onClick={toggleLogin} disabled={isLoading}>
              {isLogin ? "Create an account" : "Sign in instead"}
            </button>
          </div>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", color: "#767586" }}>
            By continuing, you agree to our{" "}
            <button type="button" className="auth-btn-text" style={{ fontSize: "0.75rem" }}>Terms</button>
            {" & "}
            <button type="button" className="auth-btn-text" style={{ fontSize: "0.75rem" }}>Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;