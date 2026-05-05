import React, { useState } from "react";
import api from '../api';
import "./style.css";

function Login({ store }) {
  const [errorMsg, setErrorMsg] = useState("");

  function Fun1(event) {
    event.preventDefault();
    setErrorMsg("");

    const email = document.getElementById("usr").value;
    const password = document.getElementById("pwd").value;

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      setErrorMsg("Only @gmail.com email addresses are allowed.");
      return;
    }

    if (password.length === 0) {
      setErrorMsg("Please enter a password.");
      return;
    }

    api.post("/check", { email, password })
      .then((res) => {
        if (res.data.role !== 0) {
          localStorage.setItem("un", res.data.name);
          localStorage.setItem("role", res.data.role);
          store.dispatch({ type: "page", data: "Home" });
        } else {
          setErrorMsg("Login Failed, Retry or Signup");
        }
      })
      .catch((err) => {
        setErrorMsg("Login request failed. Please check the server.");
        console.error(err);
      });
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: 'var(--bg-color)' }}>
      <form 
        className="saas-panel fade-in" 
        style={{ 
          padding: '40px', 
          width: '100%', 
          maxWidth: '450px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          margin: '20px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--text-main)', fontSize: '2rem', letterSpacing: '-0.02em' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0' }}>Sign in to continue to Auto Elite.</p>
        </div>

        {errorMsg && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger)', color: '#fca5a5', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="usr" style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
          <input 
            type="email" 
            id="usr" 
            className="saas-input"
            required 
            placeholder="name@gmail.com"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="pwd" style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
          <input 
            type="password" 
            id="pwd" 
            className="saas-input"
            required 
            placeholder="••••••••"
          />
        </div>

        <button  
          onClick={Fun1} 
          className="saas-btn-primary"
          style={{ marginTop: '10px' }}
        > 
          Log In 
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <a href="#" onClick={(e) => { e.preventDefault(); store.dispatch({ type: "page", data: "Signup" }); }} style={{ fontWeight: '600' }}>Sign up</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
