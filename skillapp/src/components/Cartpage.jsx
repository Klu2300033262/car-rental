import React, { useState } from 'react';
import './items.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function Cartpage({ store }) {
  const [cl, setCl] = useState(JSON.parse(localStorage.getItem("cl")) || []);

  function updateCart(newCart) {
    localStorage.setItem("cl", JSON.stringify(newCart));
    const totalQty = newCart.length;
    localStorage.setItem("count", totalQty);
    setCl(newCart);
  }

  function removeItem(index) {
    const updated = cl.filter((_, i) => i !== index);
    updateCart(updated);
  }

  function billing() {
    store.dispatch({ type: "page", data: "Billing" });
  }

  function Amount() {
    return cl.reduce((sum, item) => sum + (item.finalPrice || (item.item.pcost * item.qty)), 0);
  }

  return (
    <div className="fade-in" style={{ padding: '40px 4vw', width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
        Your Pre-Bookings Cart
      </h2>

      {cl.length === 0 ? (
        <div className="saas-panel fade-in" style={{ padding: '80px 40px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Your cart is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Explore our fleet and find your perfect ride.</p>
          <button 
            className="saas-btn-primary"
            onClick={() => store.dispatch({ type: "page", data: "Cars" })}
            style={{ width: 'auto', padding: '12px 30px' }}
          >
            Browse Cars
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {cl.map((element, index) => (
              <div 
                key={index} 
                className="saas-panel hover-scale" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '24px',
                  flexWrap: 'wrap',
                  gap: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img 
                    src={element.item.pimage} 
                    alt={element.item.pname} 
                    onError={(e) => e.target.src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2070"}
                    style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} 
                  />
                  <div>
                    <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', fontSize: '1.25rem' }}>
                      {element.item.pname}
                    </h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                      <span style={{ background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '4px', marginRight: '6px', border: '1px solid var(--border-color)' }}>
                         {element.qty} {element.bookingType === 'hours' ? 'Hours' : 'Days'}
                      </span>
                      <span style={{ background: 'var(--bg-color)', padding: '4px 8px', borderRadius: '4px', marginRight: '6px', border: '1px solid var(--border-color)' }}>
                         {element.drive === 'self' ? 'Self Drive' : 'With Driver'}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>
                      {element.date}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '1.3rem' }}>
                      Rs. {element.finalPrice || (element.item.pcost * element.qty)}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(index)} 
                    style={{ 
                      backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                      border: '1px solid var(--danger)', 
                      color: 'var(--danger)',
                      padding: '10px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.color = 'var(--danger)'; }}
                    title="Remove item"
                  >
                    <DeleteOutlineIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="saas-panel fade-in" style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', borderTop: '4px solid var(--accent)' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', color: 'var(--text-muted)' }}>Total Estimated Amount</p>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--text-main)', fontSize: '2.5rem' }}>
                Rs. {Amount()}
              </h2>
            </div>
            <button 
              className="saas-btn-primary"
              onClick={billing} 
              style={{ padding: '16px 40px', fontSize: '1.1rem', width: 'auto' }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
