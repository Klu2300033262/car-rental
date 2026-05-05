import React from 'react';

const mockFeaturedCars = [
  { pid: 101, pname: "Tesla Model S Plaid", pcost: 8500, pimage: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=2071" },
  { pid: 102, pname: "Range Rover Velar", pcost: 6500, pimage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=2070" },
  { pid: 103, pname: "BMW M4 Competition", pcost: 7200, pimage: "https://images.unsplash.com/photo-1618151313451-ea917178a9c3?auto=format&fit=crop&q=80&w=2070" }
];

export function Home({ store }) {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div
        style={{
          minHeight: '70vh',
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url("https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '4.5rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '16px',
            maxWidth: '900px',
            lineHeight: 1.1
          }}
        >
          Premium Vehicles, <br/>Zero Compromises.
        </h1>
        <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.25rem',
            color: 'var(--text-muted)',
            marginBottom: '40px',
            maxWidth: '600px',
        }}>
          Experience the next generation of car rentals. Dark mode native interfaces, instant booking, and guaranteed vehicle quality.
        </p>
        <button 
          onClick={() => {
            if (store) store.dispatch({ type: "page", data: "Cars" });
            else window.scrollTo(0, 0);
          }}
          className="saas-btn-primary hover-scale"
          style={{ width: 'auto', padding: '16px 40px', fontSize: '1.25rem' }}
        >
          Explore Cars
        </button>
      </div>

      {/* Featured Cars Section */}
      <div style={{ padding: '80px 4vw', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', margin: '0 0 10px 0' }}>Featured Vehicles</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Handpicked luxury vehicles for your next journey.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {mockFeaturedCars.map((car) => (
             <div className="saas-panel hover-scale" key={car.pid} style={{ overflow: 'hidden', padding: '0', display: 'flex', flexDirection: 'column' }}>
                <img 
                   src={car.pimage} 
                   alt={car.pname} 
                   onError={(e) => e.target.src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2070"}
                   style={{ width: '100%', height: '220px', objectFit: 'cover', borderBottom: '1px solid var(--border-color)' }} 
                />
                <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                   <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{car.pname}</h3>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '20px' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Rs. {car.pcost} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ day</span></span>
                      <button 
                         className="saas-btn-primary" 
                         style={{ padding: '8px 16px', width: 'auto' }}
                         onClick={() => {
                            localStorage.setItem("element", JSON.stringify(car));
                            if(store) store.dispatch({ type: "page", data: "AddCar" });
                         }}
                      >
                        Book Now
                      </button>
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <div className="fade-in" style={{ paddingBottom: '60px' }}>
      {/* About Hero Section */}
      <div style={{ background: 'var(--bg-surface)', padding: '80px 20px', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', margin: '0 0 20px 0' }}>Who We Are</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          Auto Elite is a premium vehicle rental platform designed to bring you the highest quality fleet with absolute transparency. We strip away the hidden fees and overlapping paperwork.
        </p>
      </div>

      <div style={{ width: '100%', padding: '0 4vw', boxSizing: 'border-box', margin: '60px 0' }}>
        {/* Mission & Vision */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '80px' }}>
          <div className="saas-panel" style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--secondary)', marginBottom: '20px' }}>Our Mission</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
              To democratize access to premium mobility. We believe that everyone deserves to drive top-tier vehicles without the long-term commitments or predatory insurance structures of traditional renting.
            </p>
          </div>
          <div className="saas-panel" style={{ padding: '40px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '20px' }}>Our Vision</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>
              A fully digital, instant-access car rental ecosystem where booking a luxury SUV is as simple as ordering food. Zero overlap. Pure performance.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%)', borderRadius: '16px', padding: '60px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px', marginBottom: '80px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '4rem', color: 'white', margin: 0, fontWeight: 800 }}>500+</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', fontWeight: 600, margin: '10px 0 0 0' }}>Premium Cars</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '4rem', color: 'white', margin: 0, fontWeight: 800 }}>10k+</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', fontWeight: 600, margin: '10px 0 0 0' }}>Active Users</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '4rem', color: 'white', margin: 0, fontWeight: 800 }}>24/7</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', fontWeight: 600, margin: '10px 0 0 0' }}>Support Team</p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '40px' }}>Why Choose Auto Elite</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', textAlign: 'left' }}>
            <div className="saas-panel" style={{ padding: '30px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⚡</div>
              <h3 style={{ marginBottom: '10px' }}>Instant Booking</h3>
              <p style={{ color: 'var(--text-muted)' }}>Skip the queues. Your digital verification clears instantly.</p>
            </div>
            <div className="saas-panel" style={{ padding: '30px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🛡️</div>
              <h3 style={{ marginBottom: '10px' }}>Total Coverage</h3>
              <p style={{ color: 'var(--text-muted)' }}>Inclusive insurance so you can drive with absolute peace of mind.</p>
            </div>
            <div className="saas-panel" style={{ padding: '30px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🚘</div>
              <h3 style={{ marginBottom: '10px' }}>Pristine Fleet</h3>
              <p style={{ color: 'var(--text-muted)' }}>Vehicles meticulously detailed and serviced before every handover.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Page2() {
  return <div><h2>This is Page 2</h2></div>;
}
