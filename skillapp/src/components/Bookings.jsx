import React, { useState, useEffect } from 'react';
import api from '../api';

export default function Bookings({ store }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/bookings')
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  }, []);

  const deleteBooking = (pid) => {
    api.delete(`/booking?pid=${pid}`)
      .then(() => {
        alert("Booking deleted");
        setBookings(bookings.filter(b => b.pid !== pid));
      })
      .catch(() => alert("Failed to delete booking"));
  };

  const rebookCar = (car) => {
    localStorage.setItem("element", JSON.stringify(car));
    store.dispatch({ type: "page", data: "AddCar" });
  };

  // Optional: format ISO date string to readable format
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const d = new Date(isoString);
    return d.toLocaleString(); // or use toLocaleDateString() and toLocaleTimeString()
  };

  return (
    <div className="card-parent">
      <div className="card" style={{ width: "auto", padding: "40px" }}>
        <h2>My Bookings</h2>
        <table border={1}>
          <thead>
            <tr>
              <th>Car</th>
              <th>Image</th>
              <th>Cost</th>
              <th>Qty</th>
              <th>Date & Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.pid}>
                <td>{b.pname}</td>
                <td><img src={b.pimage} width={100} height={60} alt={b.pname} /></td>
                <td>{b.pcost}</td>
                <td>{b.pqty}</td>
                <td>{formatDate(b.date)}</td>
                <td>
                  <button onClick={() => rebookCar(b)} style={{ marginRight: "10px", backgroundColor: "lightblue" }}>
                    Book Again
                  </button>
                  <button onClick={() => deleteBooking(b.pid)} style={{ backgroundColor: "red", color: "white" }}>
                    Delete Booking
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan="6">No Bookings Found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
