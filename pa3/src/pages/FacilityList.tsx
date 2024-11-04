// Hyomin Kim
// hyomin.kim@stonybrook.edu

// This is the component for the facility list page.
// It maps the facilities data to FacilityItem components.
import { facilities } from "../data/FacilityData";
import FacilityItem from "../components/FacilityItem";

function Facility() {
  return (
    <div className="facility-list">
      {facilities.map((facility) => (
        <FacilityItem key={facility.name} facility={facility} />
      ))}
    </div>
  );
}

export default Facility;
