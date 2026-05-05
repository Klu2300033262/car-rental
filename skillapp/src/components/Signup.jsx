import React, { useState } from "react";
import api from "../api";
import "./style.css";

function Signup({ store }) {
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [showOtpField, setShowOtpField] = useState(false);
    const [isSending, setIsSending] = useState(false);
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
        setIsSending(true);

        const { name, role, email, phone, password } = formData;

        if (!name || !role || !email || !phone || !password) {
            setErrorMsg("All fields are required.");
            setIsSending(false);
            return;
        }

        try {
            // Check for existing users before sending OTP
            const existing = await api.get("/users");
            const isEmailDuplicate = existing.data.some(user => user.email === email);
            const isPhoneDuplicate = existing.data.some(user => user.phone === phone);

            if (isEmailDuplicate) {
                setErrorMsg("An account with this email already exists.");
                setIsSending(false);
                return;
            }

            if (isPhoneDuplicate) {
                setErrorMsg("This phone number is already registered.");
                setIsSending(false);
                return;
            }

            // First, trigger the OTP on backend
            const otpResponse = await api.post("/send-otp", { phone, email });

            // Simulation Layer: We do this even if the backend logs an error internally
            if (typeof otpResponse.data === 'string' && otpResponse.data.startsWith("OTP_SENT_SUCCESS:")) {
                const simulatedOtp = otpResponse.data.split(":")[1];
                alert(`⚠️ TEST CODE:\n\nIf the Email or SMS is delayed, use this code to verify:\n\n${simulatedOtp}`);
            }

            setSuccessMsg("OTP processing initiated...");
            setShowOtpField(true);
            
        } catch (err) {
            console.error(err);
            // FAIL-SAFE: Even if the API call fails (e.g. backend is still waking up), 
            // We can still try to show the OTP field if the user wants to test the UI flow.
            setErrorMsg("Server is busy or waking up. Wait 10 seconds and try again.");
        } finally {
            setIsSending(false);
        }
    }

    async function handleFinalSignup() {
        if (!otp) {
            setErrorMsg("Please enter the 6-digit code.");
            return;
        }

        try {
            const verifyResponse = await api.post("/verify-otp", { phone: formData.phone, otp });

            if (verifyResponse.data !== "Verified") {
                setErrorMsg("Incorrect code. Please try again.");
                return;
            }

            await api.post("/user", formData);
            setSuccessMsg("Account verified! Redirecting...");
            setTimeout(() => {
                if(store) store.dispatch({ type: "page", data: "Signin" });
            }, 1000);

        } catch (error) {
            setErrorMsg("Verification failed. Check your internet connection.");
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
              <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--text-main)', fontSize: '2rem' }}>
                {showOtpField ? "Verify Account" : "Create Account"}
              </h2>
            </div>

            {errorMsg && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger)', color: '#fca5a5', borderRadius: '4px', fontSize: '0.9rem' }}>
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid var(--success)', color: '#6ee7b7', borderRadius: '4px', fontSize: '0.9rem' }}>
                {successMsg}
              </div>
            )}

            {!showOtpField ? (
                <>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.85rem' }}>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name" className="saas-input" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <label style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.85rem' }}>Type</label>
                            <select name="role" value={formData.role} onChange={handleInputChange} className="saas-input">
                                <option value="2">User</option>
                                <option value="1">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.85rem' }}>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="name@gmail.com" className="saas-input" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.85rem' }}>Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91" className="saas-input" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '0.85rem' }}>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="saas-input" />
                    </div>
                    
                    <button 
                        onClick={handleRequestOtp} 
                        className="saas-btn-primary" 
                        disabled={isSending}
                        style={{ marginTop: '15px', opacity: isSending ? 0.7 : 1 }}
                    >
                      {isSending ? "Processing..." : "Sign Up & Send Code"}
                    </button>
                </>
            ) : (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Enter the code sent to your email/phone</p>
                        <input 
                            type="text" 
                            maxLength="6" 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                            placeholder="000000" 
                            className="saas-input" 
                            style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '6px' }} 
                        />
                        <button onClick={handleFinalSignup} className="saas-btn-primary">
                            Verify & Complete
                        </button>
                    </div>
                </>
            )}

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
              <a href="#" onClick={(e) => { e.preventDefault(); if(store) store.dispatch({ type: "page", data: "Signin" }); }} style={{ fontWeight: '600' }}>Log in</a>
            </div>
        </div>
      </div>
    );
}

export default Signup;
