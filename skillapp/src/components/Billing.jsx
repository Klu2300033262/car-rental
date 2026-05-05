import React from 'react';
import api from '../api';
import './items.css';

const Billing = ({ store }) => {
  const cart = JSON.parse(localStorage.getItem('cl')) || [];
  const totalAmount = cart.reduce((sum, item) => sum + (item.finalPrice || (item.item.pcost * item.qty)), 0);

  const handleBooking = async () => {
    try {
      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        await api.post("/booking", {
          pid: item.item.pid,
          pname: item.item.pname,
          pcost: item.finalPrice || (item.item.pcost * item.qty),
          pimage: item.item.pimage,
          pqty: item.qty,
          date: item.date
        });
      }

      alert("Booking Confirmed!");

      // Clear cart
      localStorage.setItem("cl", JSON.stringify([]));
      localStorage.setItem("count", 0);
      store.dispatch({ type: "page", data: "Cars" });

    } catch (error) {
      alert("Failed to confirm booking. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="fade-in" style={{ padding: '40px 4vw', width: '100%', boxSizing: 'border-box' }}>
      <div className="saas-panel" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', color: '#F8FAFC', marginBottom: '40px' }}>Rental Invoice</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', color: 'var(--text-muted)' }}>
          <div>
            <strong>Invoice To:</strong><br/>
            {localStorage.getItem("un")}<br/>
            Date: {new Date().toLocaleDateString()}
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong>Provider:</strong><br/>
            Auto Elite Rentals<br/>
            SaaS Platform
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Vehicle & Schedule</th>
              <th style={th}>Mode</th>
              <th style={th}>Duration</th>
              <th style={th}>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td style={td}>
                  <div style={{ fontWeight: 600 }}>{item.item.pname}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.date}</div>
                </td>
                <td style={td}>{item.drive === 'self' ? 'Self-Drive' : 'With Driver'}</td>
                <td style={td}>{item.qty} {item.bookingType === 'hours' ? 'Hrs' : 'Days'}</td>
                <td style={td}>
                  Rs. {(item.finalPrice || (item.item.pcost * item.qty)).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: 'right', fontSize: '1.8rem', marginTop: '40px', color: 'var(--secondary)', fontWeight: 'bold' }}>
          Total Amount: Rs. {totalAmount.toLocaleString()}
        </div>

        <div style={{ textAlign: 'center', marginTop: '50px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            onClick={() => store.dispatch({ type: "page", data: "Cartpage" })}
            className="saas-btn-primary"
            style={{ 
              width: 'auto', 
              padding: '12px 30px', 
              background: 'transparent', 
              border: '1px solid var(--border-color)',
              color: '#F8FAFC' 
            }}
          >
            Modify Cart
          </button>
          <button
            onClick={handleBooking}
            className="saas-btn-primary"
            style={{ width: 'auto', padding: '12px 60px', background: 'var(--success)' }}
          >
            Confirm & Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

const th = {
  padding: '16px',
  textAlign: 'left',
  borderBottom: '2px solid var(--border-color)',
  color: '#94A3B8',
  textTransform: 'uppercase',
  fontSize: '0.85rem',
  fontWeight: '600'
};

const td = {
  padding: '16px',
  borderBottom: '1px solid var(--border-color)',
  color: '#F8FAFC',
};

export default Billing;
