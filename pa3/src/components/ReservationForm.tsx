// Hyomin Kim
// hyomin.kim@stonybrook.edu

// This component is a child component of FacilityReservation.tsx.
// It renders the form for making a reservation.
import React, { useState, useEffect } from "react";
import { facilities, Facility } from "../data/FacilityData";
import ReservationItem from "../components/ReservationItem";

interface ReservationFormProps {
  onSelectFacility: (facility: Facility | null) => void;
}

function ReservationForm({ onSelectFacility }: ReservationFormProps) {
  const [facility, setFacility] = useState<Facility | null>(null);

  // Set default values for the form fields
  const today = new Date();
  const [date, setDate] = useState(today.toISOString().split("T")[0]);
  const [people, setPeople] = useState(1);
  const [affiliation, setAffiliation] = useState("yes");
  const [purpose, setPurpose] = useState("");

  // Set the default facility to "Gym"
  useEffect(() => {
    const initialFacility = facilities.find((f) => f.name === "Gym") || null;
    setFacility(initialFacility);
  }, []);

  // Handle the form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!facility) return;

    const facilityCapacity = facility.participants;
    const selectedDate = new Date(date);

    // If the number of people is not within the capacity range, show an alert
    if (
      people > facilityCapacity.split(" - ").map(Number)[1] ||
      people < facilityCapacity.split(" - ").map(Number)[0]
    ) {
      alert("Cannot reserve. (Capacity)");
      return;
    }

    // Remove time information from the dates (for same-day reservation)
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    // If the selected date is before today, show an alert
    if (selectedDateOnly < todayDateOnly) {
      alert("Cannot reserve. (Date)");
      return;
    }

    // If the facility is only available for SUNY Korea students, show an alert
    if (facility.available === "Only for SUNY Korea" && affiliation === "no") {
      alert("Cannot reserve. (Affiliation)");
      return;
    }

    // Use the formula to get the day of the week
    const day = selectedDate.getDate();
    let month = selectedDate.getMonth() + 1;
    let year = selectedDate.getFullYear();

    if (month === 1 || month === 2) {
      year -= 1;
      month += 12;
    }

    const yearOfCentury = year % 100;
    const century = Math.floor(year / 100);

    const dayOfWeek =
      (day +
        Math.floor((13 * (month + 1)) / 5) +
        yearOfCentury +
        Math.floor(yearOfCentury / 4) +
        Math.floor(century / 4) +
        5 * century) % 7;
    const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

    // If the facility is not available on the selected day, show an alert
    if (!facility.days.includes(days[Math.floor(dayOfWeek)])) {
      alert("Cannot reserve. (Day of the week)");
      return;
    }

    // Create a reservation object
    const reservation = {
      facility,
      date,
      people,
      affiliation,
      purpose,
    };

    // Get the existing reservations from the local storage
    const reservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );

    // Check if there is a reservation for the same facility or date
    const sameFacility = reservations.some(
      (reservation: any) => reservation.facility.name === facility.name
    );
    const sameDate = reservations.some(
      (reservation: any) => reservation.date === date
    );

    // If there is a reservation for the same facility, show an alert
    if (sameFacility) {
      alert("Cannot reserve. (Reservation for same facility)");
      return;
    }

    // If there is a reservation for the same date, show an alert
    if (sameDate) {
      alert("Cannot reserve. (Reservation for same date)");
      return;
    }

    // Save the reservation to the local storage
    reservations.push(reservation);
    localStorage.setItem("reservations", JSON.stringify(reservations));

    alert("Reserved successfully.");
  };

  // Handle the facility change
  const handleFacilityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedFacility =
      facilities.find((f) => f.name === event.target.value) || null;
    setFacility(selectedFacility);
    onSelectFacility(selectedFacility);
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <select
            id="facility"
            className="form-control"
            value={facility?.name || ""}
            onChange={handleFacilityChange}
          >
            {facilities.map((f) => (
              <option key={f.name} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Render facility information */}
        {facility && <ReservationItem facility={facility} />}

        {/* Date to be used */}
        <div className="form-group">
          <label htmlFor="facility" className="form-label">Date to be Used:</label>
          <input
            type="date"
            id="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Number of people */}
        <div className="form-group">
          <label htmlFor="people" className="form-label">Number of People:</label>
          <input
            type="number"
            id="people"
            className="form-control"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            min="1"
          />
        </div>

        {/* Affiliation */}
        <div className="form-group">
          <div className="form-check">
            <input
              type="radio"
              id="affiliationYes"
              className="form-check-input"
              value="yes"
              checked={affiliation === "yes"}
              onChange={() => setAffiliation("yes")}
            />
            <label htmlFor="affiliationYes" className="form-check-label">SUNY Korea</label>
          </div>

          <div className="form-check">
            <input
              type="radio"
              id="affiliationNo"
              className="form-check-input"
              value="no"
              checked={affiliation === "no"}
              onChange={() => setAffiliation("no")}
            />
            <label htmlFor="affiliationNo" className="form-check-label">Non-SUNY Korea</label>
          </div>
        </div>

        {/* Purpose of use */}
        <div className="form-group">
          <label htmlFor="purpose" className="form-label">
            Purpose of Use:
          </label>
          <textarea
            id="purpose"
            className="form-control"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary submit-button">
            Reserve
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
