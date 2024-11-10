// Hyomin Kim
// hyomin.kim@stonybrook.edu

// This is the component for the facility list page.
// It fetches facilities data from the server and maps it to FacilityItem components.
import { useEffect, useState } from "react";
import axios from "axios";
import FacilityItem from "../components/FacilityItem";
import { Facility } from "../data/Types.ts";

function FacilityList() {
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/facilities");
        setFacilities(response.data);
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };
    fetchFacilities();
  }, []);

  return (
    <div className="facility-list">
      {facilities.map((facility) => (
        <FacilityItem key={facility.id} facility={facility} />
      ))}
    </div>
  );
}

export default FacilityList;
