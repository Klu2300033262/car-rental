import React, { useState } from "react";
import api from "../api";
import "./style.css";

function ForgotPassword({ store }) {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify & Reset
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    async function handleRequestOtp(e) {
        e.preventDefault();
        setMsg("");
        setError("");
        
        if (!email || !phone) {
            setError("Email and Phone are required.");
            return;
        }

        try {
            const res = await api.post("/send-otp", { phone, email });
            if (typeof res.data === 'string' && res.data.startsWith("OTP_SENT_SUCCESS:")) {
                const simulatedOtp = res.data.split(":")[1];
                alert(`⚠️ RESET CODE:\n\nUse this code to reset your password:\n${simulatedOtp}`);
            }
            setStep(2);
            setMsg("Verification code sent to your email and phone.");
        } catch (err) {
            setError("Failed to send code. Check if user exists.");
        }
    }

    async function handleResetPassword(e) {
        e.preventDefault();
        setMsg("");
        setError("");

        if (!otp || !newPassword) {
            setError("OTP and New Password are required.");
            return;
        }

        try {
            const verifyRes = await api.post("/verify-otp", { phone, otp });
            if (verifyRes.data !== "Verified") {
                setError("Invalid Verification Code.");
                return;
            }

            const resetRes = await api.post("/reset-password", { email, password: newPassword });
            if (resetRes.data.includes("Successfully")) {
                setMsg("Password reset successfully! Redirecting...");
                setTimeout(() => {
                    store.dispatch({ type: "page", data: "Signin" });
                }, 1500);
            } else {
                setError(resetRes.data);
            }
        } catch (err) {
            setError("Password reset failed.");
        }
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: 'var(--bg-color)' }}>
            <div className="saas-panel fade-in" style={{ padding: '40px', width: '100%', maxWidth: '450px' }}>
                <h2 style={{ textAlign: 'center', color: 'var(--text-main)', marginBottom: '10px' }}>Reset Password</h2>
                
                {msg && <div style={{ color: '#6ee7b7', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{msg}</div>}
                {error && <div style={{ color: '#fca5a5', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

                {step === 1 ? (
                    <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Registered Email</label>
                            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="saas-input" placeholder="name@gmail.com" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Registered Phone</label>
                            <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} className="saas-input" placeholder="+91" />
                        </div>
                        <button type="submit" className="saas-btn-primary">Send Reset Code</button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Verification Code</label>
                            <input type="text" maxLength="6" value={otp} onChange={(e)=>setOtp(e.target.value)} className="saas-input" placeholder="000000" style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>New Password</label>
                            <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="saas-input" placeholder="Minimal 8 chars" />
                        </div>
                        <button type="submit" className="saas-btn-primary">Update Password</button>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <a href="#" onClick={(e) => { e.preventDefault(); store.dispatch({ type: "page", data: "Signin" }); }} style={{ color: 'var(--text-muted)' }}>Back to Login</a>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
