import React, { useState } from "react";
import api from "../api";
import "./style.css";

function Signup({ store }) {
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    async function handleSignup(event) {
        event.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        const name = document.getElementById("usrname").value.trim();
        const role = document.getElementById("sel1").value;
        const email = document.getElementById("usr").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("pwd").value;

        if (!name || !role || !email || !phone || !password) {
            setErrorMsg("All fields are required.");
            return;
        }

        if (!email.endsWith("@gmail.com")) {
            setErrorMsg("Only @gmail.com emails are allowed.");
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!passwordRegex.test(password)) {
            setErrorMsg("Password must be 8+ chars and include 1 uppercase and 1 symbol.");
            return;
        }

        try {
            const existing = await api.get("/users");
            const isDuplicate = existing.data.some(user => user.email === email);
            if (isDuplicate) {
                setErrorMsg("Account with this email already exists.");
                return;
            }
        } catch (err) {
            setErrorMsg("Error checking existing users. Make sure backend is running.");
            return;
        }

        try {
            await api.post(
                "/send-otp",
                { phone }
            );

            const otp = prompt("Enter the OTP sent to your phone:");
            if (!otp) {
                setErrorMsg("OTP is required to complete registration.");
                return;
            }

            const verifyResponse = await api.post(
                "/verify-otp",
                { phone, otp }
            );

            if (verifyResponse.data !== "Verified") {
                setErrorMsg("Invalid OTP. Signup cancelled.");
                return;
            }
        } catch (error) {
            setErrorMsg("OTP verification failed.");
            return;
        }

        try {
            await api.post(
                "/user",
                { name, role, email, phone, password }
            );
            setSuccessMsg("Account created successfully! Redirecting...");
            setTimeout(() => {
                if(store) store.dispatch({ type: "page", data: "Signin" });
            }, 1500);
        } catch (err) {
            setErrorMsg("Signup failed. Check console for details.");
        }
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '40px 0', backgroundColor: 'var(--bg-color)' }}>
        <form 
          className="saas-panel fade-in" 
          style={{ 
            padding: '40px', 
            width: '100%', 
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            margin: '20px'
          }}
        >
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--text-main)', fontSize: '2rem', letterSpacing: '-0.02em' }}>Create Account</h2>
              <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0' }}>Join Auto Elite to rent luxury vehicles</p>
            </div>

            {errorMsg && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger)', color: '#fca5a5', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid var(--success)', color: '#6ee7b7', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 500 }}>
                {successMsg}
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label htmlFor="usrname" style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>Full Name *</label>
                  <input type="text" id="usrname" required placeholder="John Doe" className="saas-input" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label htmlFor="sel1" style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>Account Type *</label>
                  <select id="sel1" required className="saas-input">
                      <option value="2">User</option>
                      <option value="1">Admin</option>
                  </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="usr" style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>Email Address *</label>
                <input type="email" id="usr" required placeholder="name@gmail.com" className="saas-input" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="phone" style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>Phone Number *</label>
                <input type="tel" id="phone" required placeholder="+1 234 567 8900" className="saas-input" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="pwd" style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>Password *</label>
                <input type="password" id="pwd" required placeholder="••••••••" className="saas-input" />
            </div>
            
            <button 
              onClick={handleSignup} 
              className="saas-btn-primary"
              style={{ marginTop: '15px' }}
            >
              Sign Up
            </button>

            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
              <a href="#" onClick={(e) => { e.preventDefault(); if(store) store.dispatch({ type: "page", data: "Signin" }); }} style={{ fontWeight: '600' }}>Log in</a>
            </div>
        </form>
      </div>
    );
}

export default Signup;
