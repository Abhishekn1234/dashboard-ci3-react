import React,{useState,useEffect} from "react";
import { PersonCircle, GearFill, Building } from "react-bootstrap-icons";

export default function Navbar() {
  const [orders, setOrders] = useState([]);
   useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
  try {
    const response = await fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/production/api_list");
    const data = await response.json();
    setOrders(data);
  } catch (err) {
    console.error("Failed to fetch orders", err);
  }
};
  const today = new Date().toISOString().split("T")[0];
const unitsToday = orders
  .filter(order => new Date(order.created_at).toISOString().split("T")[0] === today)
  .reduce((sum, order) => sum + (parseInt(order.units_produced) || 0), 0);
const calculateOEE = (orders) => {
  const todayOrders = orders.filter(order => new Date(order.created_at).toISOString().split("T")[0] === today);
  if (todayOrders.length === 0) return 0;

  let totalOEE = 0;
  let count = 0;

  todayOrders.forEach(order => {
    const { availability, performance, quality } = order;
    if (availability && performance && quality) {
      const oee = (availability * performance * quality) / 10000;
      totalOEE += oee;
      count++;
    }
  });

  return count > 0 ? totalOEE / count : 0;
};

const todayOEE = calculateOEE(orders).toFixed(1); // e.g., 95.2

  return (
    <>
      <div className="bg-primary text-white p-3 m-0">
        {/* Top Bar with icons and title */}
        <div className="d-flex justify-content-between align-items-center">
          {/* Left Icon */}
          <div className="me-2">
            <GearFill size={24} />
          </div>

          {/* Title */}
          <div className="flex-grow-1 text-left">
            <h1 className="fs-4 m-0">Manufacturing Management System</h1>
          </div>

          {/* Right Section: Plant & Profile */}
          <div className="d-flex align-items-center ms-2">
            <Building size={20} className="me-2" />
            <span className="me-3">Plant A</span>
            <PersonCircle size={24} />
          </div>
        </div>

        {/* Cards aligned from left side */}
        <div className="row g-2 ms-1 mt-3">
          {/* Card 1 */}
         {/* Card 1 - OEE */}
<div className="col-auto">
  <div
    className="card text-white text-center m-0"
    style={{
      backgroundColor: "red",
      borderRadius: "50px",
      height: "40px",
      width: "120px",
    }}
  >
    <div className="card-body d-flex align-items-center justify-content-center p-0">
      <p className="card-text m-0">OEE: {todayOEE}%</p>
    </div>
  </div>
</div>

{/* Card 2 - Units Today */}
<div className="col-auto">
  <div
    className="card text-white text-center m-0"
    style={{
      backgroundColor: "#5bc0de",
      borderRadius: "50px",
      height: "40px",
      width: "160px",
    }}
  >
    <div className="card-body d-flex align-items-center justify-content-center p-0">
      <p className="card-text m-0">Units Today: {unitsToday}</p>
    </div>
  </div>
</div>

          {/* Card 3 */}
          <div className="col-auto">
            <div
              className="card text-dark text-center m-0"
              style={{
                backgroundColor: "yellow",
                borderRadius: "50px",
                height: "40px",
                width: "170px",
              }}
            >
              <div className="card-body d-flex align-items-center justify-content-center p-0">
                <p className="card-text m-0">Defect Rate: 2.1%</p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="col-auto">
            <div
              className="card text-white text-center m-0"
              style={{
                backgroundColor: "red",
                borderRadius: "50px",
                height: "40px",
                width: "100px",
              }}
            >
              <div className="card-body d-flex align-items-center justify-content-center p-0">
                <p className="card-text m-0">Alert: 1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
