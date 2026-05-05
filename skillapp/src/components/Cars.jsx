import React, { useState, useEffect } from 'react';
import './items.css';
import api from '../api';

// Injecting 8 Dummy Cars to ensure minimum inventory without altering backend APIs
const mockInventory = [
  { pid: "mock_1", pname: "Audi RS e-tron GT", pcost: 9500, pimage: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=2070" },
  { pid: "mock_2", pname: "Mercedes-Benz G-Class", pcost: 11000, pimage: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=2069" },
  { pid: "mock_3", pname: "Porsche 911 Carrera", pcost: 12500, pimage: "https://images.unsplash.com/photo-1503376760302-83f06082ddfc?auto=format&fit=crop&q=80&w=2070" },
  { pid: "mock_4", pname: "BMW M5 Competition", pcost: 8800, pimage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=2070" },
  { pid: "mock_5", pname: "Range Rover Sport", pcost: 7600, pimage: "https://images.unsplash.com/photo-1549421256-42ee93c830b8?auto=format&fit=crop&q=80&w=2070" },
  { pid: "mock_6", pname: "Lexus LC 500", pcost: 8200, pimage: "https://images.unsplash.com/photo-1623910271000-0e19a4e32d84?auto=format&fit=crop&q=80&w=2070" },
  { pid: "mock_7", pname: "Alfa Romeo Giulia Quadrifoglio", pcost: 7100, pimage: "https://images.unsplash.com/photo-1598501289139-4d6938a9a464?auto=format&fit=crop&q=80&w=2070" },
  { pid: "mock_8", pname: "Tesla Model X", pcost: 8900, pimage: "https://images.unsplash.com/photo-1622329384992-06bba308b2dc?auto=format&fit=crop&q=80&w=2070" },
];

export default function Cars({ store }) {
  const [result, setResult] = useState([]);
  const [filteredResult, setFilteredResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    api.get("/cars")
      .then((res) => {
        // Map over data to fix the 'hp1' placeholder issue seen in training data
        const sanitizedBackend = res.data.map(item => {
          let updated = { ...item };
          
          // Fix hp1 placeholder
          if (updated.pname === "hp1") {
            updated.pname = "Mercedes-AMG GT";
            updated.pcost = 8500;
            updated.pimage = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=2070";
          }
          
          // Normalize Overpriced Backend Cars
          const lowerName = updated.pname.toLowerCase();
          if (lowerName.includes("innova")) updated.pcost = 5500;
          if (lowerName.includes("swift")) updated.pcost = 1800;
          if (lowerName.includes("thar")) updated.pcost = 3800;
          if (lowerName.includes("kia")) updated.pcost = 3200;
          if (lowerName.includes("nexon")) updated.pcost = 2900;
          
          return updated;
        });

        // Concatenate genuine backend vehicles with our frontend dummy inventory
        const combined = [...sanitizedBackend, ...mockInventory];
        setResult(combined);
        setFilteredResult(combined);
        setTimeout(() => setLoading(false), 500); 
      })
      .catch((err) => {
        console.error("Failed to fetch cars:", err);
        // Fallback to purely dummy cars if backend fails so UI remains functional
        setResult(mockInventory);
        setFilteredResult(mockInventory);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let temp = [...result];
    
    if (searchTerm) {
      temp = temp.filter(item => item.pname.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    if (sortOrder === 'low') {
      temp.sort((a, b) => a.pcost - b.pcost);
    } else if (sortOrder === 'high') {
      temp.sort((a, b) => b.pcost - a.pcost);
    }
    
    setFilteredResult(temp);
  }, [searchTerm, sortOrder, result]);

  function cardAction(item) {
    localStorage.setItem("element", JSON.stringify(item));
    store.dispatch({ type: "page", data: "AddCar" });
  }

  function getFeatures(name) {
    const n = name.toLowerCase();
    const isSUV = n.includes('suv') || n.includes('rover') || n.includes('jeep') || n.includes('g-class') || n.includes('model x');
    const seats = isSUV ? '7 Seats' : '5 Seats';
    const transmission = n.includes('manual') ? 'Manual' : 'Auto';
    const fuel = n.includes('tesla') || n.includes('e-tron') || n.includes('ev') ? 'Electric' : 'Petrol';
    return [seats, transmission, fuel];
  }

  return (
    <div className="fade-in" style={{ padding: '40px 4vw', width: '100%', boxSizing: 'border-box' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', margin: '0 0 10px 0', fontSize: '2.5rem', color: 'var(--text-main)' }}>Available Vehicles</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>Select a vehicle to view details and proceed with booking.</p>
      </div>

      <div className="saas-panel" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px',
        padding: '20px',
      }}>
        <input 
          type="text" 
          placeholder="Search by model..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="saas-input"
          style={{ width: 'auto', minWidth: '280px' }}
        />
        
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className="saas-input"
          style={{ width: 'auto', cursor: 'pointer' }}
        >
          <option value="default">Sort by: Recommended</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      <div className='card-parent'>
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map(skeleton => (
            <div className='card skeleton' key={skeleton} style={{ border: 'none', minHeight: '380px' }}></div>
          ))
        ) : filteredResult.length > 0 ? (
          filteredResult.map((item) => (
            <div className='card' key={item.pid}>
              <img 
                className='card-img' 
                src={item.pimage} 
                alt={item.pname} 
                onError={(e) => e.target.src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2070"} 
              />
              <div className='card-content'>
                <h2>{item.pname}</h2>
                <div className='card-features'>
                  {getFeatures(item.pname).map((f, idx) => (
                    <span key={idx} className="feature-badge">{f}</span>
                  ))}
                </div>
                <div className='price-section'>
                  <div className='card-price'>
                    Rs. {item.pcost} <span>/ day</span>
                  </div>
                  <button className='book-btn' onClick={() => cardAction(item)}>Book Now</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', margin: '0 0 10px 0' }}>No vehicles found matching "{searchTerm}"</h3>
            <p>Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
