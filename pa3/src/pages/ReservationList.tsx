// Hyomin Kim
// hyomin.kim@stonybrook.edu

// This is the component for the reservation list page.
// It displays the reservations made by the user.
import { useState, useEffect } from "react";
import ReservedItem from "../components/ReservedItem";

function Reservations() {
  const [reservations, setReservations] = useState<any[]>([]);

  // Load reservations from local storage
  useEffect(() => {
    const savedReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    setReservations(savedReservations);
  }, []);

  // Delete a reservation
  const handleDelete = (facilityName: string) => {
    const updatedReservations = reservations.filter(
      (reservation) => reservation.facility.name !== facilityName
    );
    setReservations(updatedReservations);
    localStorage.setItem("reservations", JSON.stringify(updatedReservations));
  };

  return (
    <div className="container mt-4">
      {reservations.length === 0 ? (
        <h1>No reservations found.</h1>
      ) : (
        <div className="reservation-list">
          {reservations.map((reservation, index) => (
            <ReservedItem
              key={index}
              reservation={reservation}
              onDelete={() => handleDelete(reservation.facility.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Reservations;
