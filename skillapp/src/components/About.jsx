import React from 'react';

export default function About() {
  return (
    <div style={{
      maxWidth: "900px",
      margin: "auto",
      padding: "30px",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      lineHeight: "1.6",
    }}>
      <h1 style={{ color: "#333" }}>About Car Rental Service</h1>
      <p>
        Welcome to our Car Rental platform! We provide a seamless experience for booking cars across your city for personal or business travel needs.
      </p>
      <p>
        Whether you need a car for a few hours or multiple days, we've got you covered. Our fleet includes compact cars, SUVs, and luxury vehicles—all well maintained and easy to book.
      </p>
      <h3>Why Choose Us?</h3>
      <ul style={{ textAlign: "left", paddingLeft: "20%", color: "#444" }}>
        <li>✅ Easy and instant online booking</li>
        <li>✅ Wide range of cars at competitive prices</li>
        <li>✅ Option to choose self-drive or chauffeur-driven</li>
        <li>✅ Real-time availability and transparent pricing</li>
      </ul>
      <p style={{ marginTop: "20px" }}>
        Our mission is to make car rental convenient, affordable, and enjoyable for everyone. Thank you for choosing us!
      </p>
    </div>
  );
}
