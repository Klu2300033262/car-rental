import React, { useState, useEffect } from 'react'

export default function AddCar({ store }) {
  const item = JSON.parse(localStorage.getItem("element")) || {};
  
  // State for booking type and options
  const [bookingType, setBookingType] = useState("days"); // "days" or "hours"
  const [driveOption, setDriveOption] = useState("self"); // "self" or "with-driver"
  
  // State for dates and times
  const today = new Date().toISOString().slice(0, 16); // For datetime-local min attribute
  const [fromDt, setFromDt] = useState("");
  const [toDt, setToDt] = useState("");
  
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [calculatedDuration, setCalculatedDuration] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  let cl = JSON.parse(localStorage.getItem("cl")) || [];

  // Recalculate duration and price whenever inputs change
  useEffect(() => {
    if (fromDt && toDt) {
      const start = new Date(fromDt);
      const end = new Date(toDt);
      
      if (end <= start) {
        setErrorMsg("'To' date/time must be after 'From' date/time.");
        setCalculatedDuration(0);
        setTotalPrice(0);
        return;
      }
      
      setErrorMsg("");
      const diffMs = end - start;
      
      if (bookingType === "days") {
        const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        setCalculatedDuration(days);
        
        const base = item.pcost || 0;
        const driverSurcharge = driveOption === "with-driver" ? 1500 : 0;
        setTotalPrice(days * (base + driverSurcharge));
      } else {
        const hours = Math.ceil(diffMs / (1000 * 60 * 60));
        setCalculatedDuration(hours);
        
        const baseHourPrice = Math.round((item.pcost || 0) / 10);
        const driverSurcharge = driveOption === "with-driver" ? 250 : 0;
        setTotalPrice(hours * (baseHourPrice + driverSurcharge));
      }
    }
  }, [fromDt, toDt, bookingType, driveOption, item.pcost]);

  const handleNext = () => {
    if (step === 2) {
      if (!fromDt || !toDt) {
        setErrorMsg("Please select both 'From' and 'To' times.");
        return;
      }
      if (new Date(toDt) <= new Date(fromDt)) {
        return; // Error message already set by useEffect
      }
    }
    setStep(step + 1);
  };

  function bookCar() {
    let c = 0;
    cl.push({
      item: item,
      qty: calculatedDuration,
      date: `${fromDt} to ${toDt}`,
      drive: driveOption,
      bookingType: bookingType,
      finalPrice: totalPrice
    });

    localStorage.setItem("cl", JSON.stringify(cl));
    cl.forEach(el => {
      c += 1; // Count items, not just qty
    });
    localStorage.setItem("count", c);
    store.dispatch({ type: "page", data: "Cartpage" });
  }

  const StepperItem = ({ num, label, active }) => (
    <div style={{ display: 'flex', alignItems: 'center', opacity: active ? 1 : 0.4 }}>
      <div style={{ 
        width: '32px', height: '32px', borderRadius: '50%', 
        background: active ? 'var(--accent)' : 'var(--border-color)', 
        color: active ? 'white' : 'var(--text-muted)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontWeight: 'bold', marginRight: '12px'
      }}>
        {num}
      </div>
      <span style={{ fontWeight: active ? 600 : 400, color: 'var(--text-main)' }}>{label}</span>
    </div>
  );

  return (
    <div className="fade-in" style={{ padding: '40px 4vw', width: '100%', boxSizing: 'border-box', display: 'flex', gap: '4vw', flexWrap: 'wrap' }}>
      
      {/* Left Column: Car Info */}
      <div className="saas-panel" style={{ flex: '1 1 500px', maxWidth: '800px', padding: '30px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: 0, fontSize: '2rem', color: 'var(--text-main)' }}>
          Vehicle Specifications
        </h2>
        
        <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', margin: '20px 0', border: '1px solid var(--border-color)' }}>
          <img 
            src={item.pimage} 
            alt={item.pname} 
            onError={(e) => e.target.src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2070"}
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', maxHeight: '400px' }} 
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--text-main)' }}>{item.pname}</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Premium Luxury Segment</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--secondary)' }}>Rs. {item.pcost}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}> / day</span>
          </div>
        </div>
      </div>

      {/* Right Column: Steps */}
      <div className="saas-panel" style={{ flex: '1 1 400px', padding: '40px', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <StepperItem num={1} label="Preferences" active={step >= 1} />
          <StepperItem num={2} label="Schedule" active={step >= 2} />
          <StepperItem num={3} label="Confirm" active={step >= 3} />
        </div>

        {step === 1 && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <h3 style={{ margin: '0 0 24px 0', color: 'var(--text-main)', fontSize: '1.4rem' }}>How would you like to drive?</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem' }}>Rental Type</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setBookingType("days")}
                  style={{ 
                    flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', 
                    background: bookingType === "days" ? 'var(--accent)' : 'var(--bg-color)',
                    color: 'white', fontWeight: 600, cursor: 'pointer'
                  }}
                >Daily Basis</button>
                <button 
                  onClick={() => setBookingType("hours")}
                  style={{ 
                    flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', 
                    background: bookingType === "hours" ? 'var(--accent)' : 'var(--bg-color)',
                    color: 'white', fontWeight: 600, cursor: 'pointer'
                  }}
                >Hourly Rental</button>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem' }}>Driving Mode</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setDriveOption("self")}
                  style={{ 
                    flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', 
                    background: driveOption === "self" ? 'var(--secondary)' : 'var(--bg-color)',
                    color: 'white', fontWeight: 600, cursor: 'pointer'
                  }}
                >Self Driving</button>
                <button 
                  onClick={() => setDriveOption("with-driver")}
                  style={{ 
                    flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', 
                    background: driveOption === "with-driver" ? 'var(--secondary)' : 'var(--bg-color)',
                    color: 'white', fontWeight: 600, cursor: 'pointer'
                  }}
                >With Driver</button>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px' }}>
                {driveOption === "with-driver" ? "✨ Professional driver assistance included (Surcharge applies)." : "🛡️ Standard insurance coverage included for self-drive."}
              </p>
            </div>
            
            <button onClick={handleNext} className="saas-btn-primary" style={{ marginTop: 'auto' }}>
              Set Dates & Time
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <h3 style={{ margin: '0 0 24px 0', color: 'var(--text-main)', fontSize: '1.4rem' }}>Set your schedule</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#F8FAFC', fontSize: '0.9rem' }}>From (Start)</label>
              <input
                type="datetime-local"
                value={fromDt}
                min={today}
                onChange={(e) => setFromDt(e.target.value)}
                className="saas-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#F8FAFC', fontSize: '0.9rem' }}>To (End)</label>
              <input
                type="datetime-local"
                value={toDt}
                min={fromDt || today}
                onChange={(e) => setToDt(e.target.value)}
                className="saas-input"
                style={{ border: errorMsg ? '1px solid var(--danger)' : undefined }}
              />
              {errorMsg && (
                 <div style={{ color: '#fca5a5', fontSize: '0.85rem', marginTop: '6px', fontWeight: 500 }}>
                   {errorMsg}
                 </div>
              )}
            </div>

            {calculatedDuration > 0 && !errorMsg && (
              <div className="saas-panel" style={{ padding: '15px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid var(--secondary)', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F8FAFC' }}>
                  <span>Calculated Duration:</span>
                  <span style={{ fontWeight: 'bold' }}>{calculatedDuration} {bookingType === "days" ? "Days" : "Hours"}</span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', marginTop: 'auto' }}>
              <button
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: '14px', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600 }}
              >Back</button>
              <button
                onClick={handleNext}
                disabled={!!errorMsg || !fromDt || !toDt}
                className="saas-btn-primary"
                style={{ flex: 2 }}
              >Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <h3 style={{ margin: '0 0 24px 0', color: 'var(--text-main)', fontSize: '1.4rem' }}>Final Summary</h3>
            
            <div style={{ background: 'var(--bg-color)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Service Type:</span>
                <span style={{ fontWeight: 600 }}>{bookingType === "days" ? 'Daily Basis' : 'Hourly Rental'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Driving Mode:</span>
                <span style={{ fontWeight: 600 }}>{driveOption === 'self' ? 'Self Drive' : 'With Driver'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total {bookingType === "days" ? "Days" : "Hours"}:</span>
                <span style={{ fontWeight: 600 }}>{calculatedDuration} {bookingType === "days" ? "Days" : "Hours"}</span>
              </div>
              
              <div style={{ marginTop: '20px', borderTop: '1px dotted var(--border-color)', paddingTop: '20px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <span>Vehicle Base Cost:</span>
                    <span>Rs. {totalPrice - (driveOption === "with-driver" ? (bookingType === "days" ? 1500 * calculatedDuration : 250 * calculatedDuration) : 0)}</span>
                 </div>
                 {driveOption === "with-driver" && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <span>Driver Surcharge:</span>
                      <span>Rs. {bookingType === "days" ? 1500 * calculatedDuration : 250 * calculatedDuration}</span>
                    </div>
                 )}
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                   <span style={{ color: 'var(--text-main)', fontWeight: 'bold', fontSize: '1.2rem' }}>Grand Total:</span>
                   <span style={{ fontWeight: 'bold', color: 'var(--secondary)', fontSize: '1.4rem' }}>Rs. {totalPrice}</span>
                 </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: 'auto' }}>
              <button
                onClick={() => setStep(2)}
                style={{ flex: 1, padding: '14px', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600 }}
              >Back</button>
              <button
                onClick={bookCar}
                className="saas-btn-primary"
                style={{ flex: 2, background: 'var(--success)' }}
              >Confirm & Add</button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
