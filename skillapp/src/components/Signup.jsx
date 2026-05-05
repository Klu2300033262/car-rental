import React, { useState } from "react";
import api from "../api";
import "./style.css";

function Signup({ store }) {
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showOtpField, setShowOtpField] = useState(false);
    const [otp, setOtp] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        role: "2",
        email: "",
        phone: "",
        password: ""
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleRequestOtp(event) {
        event.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        const { name, role, email, phone, password } = formData;

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

            const otpResponse = await api.post("/send-otp", { phone, email });

            if (typeof otpResponse.data === 'string' && otpResponse.data.startsWith("OTP_SENT_SUCCESS:")) {
                const simulatedOtp = otpResponse.data.split(":")[1];
                alert(`⚠️ SIMULATION MODE:\n\nIf SMS or Email did not arrive, use this code:\n${simulatedOtp}`);
            }

            setShowOtpField(true);
            setSuccessMsg("OTP sent to your phone and email!");
        } catch (err) {
            setErrorMsg("Failed to send OTP. Make sure backend is running.");
        }
    }

    async function handleFinalSignup() {
        if (!otp) {
            setErrorMsg("Please enter the OTP to verify.");
            return;
        }

        try {
            const verifyResponse = await api.post("/verify-otp", { phone: formData.phone, otp });

            if (verifyResponse.data !== "Verified") {
                setErrorMsg("Invalid OTP. Verification failed.");
                return;
            }

            // If verified, proceed to create user
            await api.post("/user", formData);
            setSuccessMsg("Account created successfully! Redirecting...");
            setTimeout(() => {
                if(store) store.dispatch({ type: "page", data: "Signin" });
            }, 1500);

        } catch (error) {
            setErrorMsg("Signup process failed. Check console.");
        }
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '40px 0', backgroundColor: 'var(--bg-color)' }}>
        <div 
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
              <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--text-main)', fontSize: '2rem', letterSpacing: '-0.02em' }}>
                {showOtpField ? "Verify Account" : "Create Account"}
              </h2>
              <p style={{ color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
                {showOtpField ? "Check your email & phone for the code" : "Join Auto Elite to rent luxury vehicles"}
              </p>
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

            {!showOtpField ? (
                <>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>Full Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="saas-input" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>Account Type *</label>
                            <select name="role" value={formData.role} onChange={handleInputChange} className="saas-input">
                                <option value="2">User</option>
                                <option value="1">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="name@gmail.com" className="saas-input" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>Phone Number *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 00000 00000" className="saas-input" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.9rem' }}>Password *</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="saas-input" />
                    </div>
                    
                    <button onClick={handleRequestOtp} className="saas-btn-primary" style={{ marginTop: '15px' }}>
                      Sign Up & Send Code
                    </button>
                </>
            ) : (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
                        <label style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '1.1rem' }}>Enter 6-Digit OTP</label>
                        <input 
                            type="text" 
                            maxLength="6" 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                            placeholder="000000" 
                            className="saas-input" 
                            style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px' }} 
                        />
                        <button onClick={handleFinalSignup} className="saas-btn-primary">
                            Verify & Complete Registration
                        </button>
                        <button onClick={() => setShowOtpField(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            ← Back to Details
                        </button>
                    </div>
                </>
            )}

            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
              <a href="#" onClick={(e) => { e.preventDefault(); if(store) store.dispatch({ type: "page", data: "Signin" }); }} style={{ fontWeight: '600' }}>Log in</a>
            </div>
        </div>
      </div>
    );
}

export default Signup;
