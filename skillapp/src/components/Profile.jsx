import React, { useState, useEffect } from 'react';
import api from '../api';
import './items.css';

export default function Profile({ store }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const userName = localStorage.getItem("un") || "Guest User";
  const roleCode = localStorage.getItem("role");
  const roleName = roleCode === "1" ? "Administrator" : "Standard User";

  useEffect(() => {
    api.get('/bookings')
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const deleteBooking = (pid) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      api.delete(`/booking?pid=${pid}`)
        .then(() => {
          setBookings(bookings.filter(b => b.pid !== pid));
        })
        .catch(() => alert("Failed to delete booking."));
    }
  };

  const rebookCar = (car) => {
    localStorage.setItem("element", JSON.stringify(car));
    store.dispatch({ type: "page", data: "AddCar" });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const d = new Date(isoString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fade-in" style={{ padding: '40px 4vw', width: '100%', boxSizing: 'border-box' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginBottom: '30px', fontSize: '2.5rem' }}>
        My Profile
      </h1>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Left Panel: User Info */}
        <div className="saas-panel" style={{ flex: '1 1 300px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%)', 
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)'
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ margin: '0 0 5px 0', color: 'var(--text-main)' }}>{userName}</h2>
          <span style={{ background: 'var(--border-color)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {roleName}
          </span>
          
          <div style={{ width: '100%', marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
             <button 
                className="saas-btn-primary" 
                style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }}
                onClick={() => {
                  localStorage.setItem("un", "null");
                  localStorage.setItem("role", 0);
                  store.dispatch({ type: "page", data: "Signin" });
                }}
             >
                Sign Out
             </button>
          </div>
        </div>

        {/* Right Panel: Booking History */}
        <div className="saas-panel" style={{ flex: '2 1 600px', padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', fontSize: '1.5rem' }}>
              Booking History
            </h2>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
            ) : bookings.length === 0 ? (
              <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>You have no past vehicle bookings.</p>
                <button className="saas-btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => store.dispatch({ type: "page", data: "Cars" })}>
                  Explore Fleet
                </button>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '15px', textAlign: 'left', background: 'var(--bg-color)', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>Vehicle</th>
                    <th style={{ padding: '15px', textAlign: 'left', background: 'var(--bg-color)', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>Date</th>
                    <th style={{ padding: '15px', textAlign: 'left', background: 'var(--bg-color)', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>Est. Cost</th>
                    <th style={{ padding: '15px', textAlign: 'right', background: 'var(--bg-color)', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.pid} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <img 
                            src={b.pimage} 
                            alt={b.pname} 
                            onError={(e) => e.target.src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2070"}
                            style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                          />
                          <div>
                             <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{b.pname}</div>
                             <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {b.pqty}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '15px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        {formatDate(b.date)}
                      </td>
                      <td style={{ padding: '15px', color: 'var(--success)', fontWeight: 'bold' }}>
                        Rs. {b.pcost}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right' }}>
                        <button 
                          onClick={() => rebookCar(b)} 
                          style={{ marginRight: "10px", background: 'var(--bg-color)', color: 'var(--secondary)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem' }}
                        >
                          Rebook
                        </button>
                        <button 
                          onClick={() => deleteBooking(b.pid)} 
                          style={{ background: 'transparent', color: 'var(--danger)', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem' }}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
