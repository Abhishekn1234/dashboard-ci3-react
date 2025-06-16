import React,{useState,useEffect,useRef} from "react";
import './Maintenance.css'; 
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Maintenance() {
  const formRef = useRef(null);

  const handleScheduleClick = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

        const [maintenanceRecords, setMaintenanceRecords] = useState([]);

  useEffect(() => {
    fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/MaintenanceController/history")
      .then((res) => res.json())
      .then((data) => setMaintenanceRecords(data))
      .catch((err) => console.error("Failed to load history:", err));
  }, []);

  const [maintenanceData, setMaintenanceData] = useState([]);

  useEffect(() => {
    fetch(
      "http://localhost/express/backend/CodeIgniter-3.1.13/index.php/MaintenanceController/schedule"
    )
      .then((res) => res.json())
      .then((data) => setMaintenanceData(data))
      .catch((err) => console.error("Error loading schedule:", err));
  }, []);


 const [alerts, setAlerts] = useState([]);

  useEffect(() => {
  fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/MaintenanceController/active")
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched alerts:", data); // 👈 Add this
      setAlerts(data);
    })
    .catch((err) => console.error("Alert fetch failed", err));
}, []);


  const handleAction = async (id, status, label) => {
  try {
    const res = await fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/MaintenanceController/update_status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, trigger_status: status }),
    });

    const data = await res.json();
    if (data.status === "success") {
      toast.success(`${label} for ID ${id} successfully`, { autoClose: 2000 });
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, trigger_status: status } : a))
      );
    } else {
      toast.error("Update failed", { autoClose: 2000 });
    }
  } catch (error) {
    console.error("API error:", error);
    toast.error("API request failed", { autoClose: 2000 });
  }
};

  const [machine, setMachine] = useState("Hydraulic Press #1");
  const [issueType, setIssueType] = useState("Mechanical");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("");

  const handleSubmit = async () => {
    const requestData = {
      machine,
      issue_type: issueType,
      description,
      urgency,
    };

    try {
      const response = await fetch(
        "http://localhost/express/backend/CodeIgniter-3.1.13/index.php/MaintenanceController/submit_request", // Change this to your actual path
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <>
   <div style={{ maxWidth: "100%", margin: "0px",marginLeft:"5px" }}>
  <div
    style={{
      display: "flex",
      marginLeft:"5px",
      gap: "20px", // space between cards
      flexWrap: "wrap", // makes it responsive for smaller screens
    }}
  >
    {/* Maintenance Schedule Card */}
    <div
      className="card mb-4"
      style={{
        borderRadius: "10px",
        padding: "20px",
        flex: "1",
        height:"330px",
        minWidth: "350px", // optional: controls how cards wrap on small screens
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Maintenance Schedule</h5>
        <button
            className="btn btn-primary"
            style={{ fontWeight: "bold" }}
            onClick={handleScheduleClick}
          >
          Schedule +
        </button>
      </div>
      <hr />
      <table className="table table-bordered table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th>Machine</th>
            <th>Last Service</th>
            <th>Next Due</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceData.map(({ machine, lastService, nextDue, status }, idx) => (
            <tr key={idx}>
              <td>{machine}</td>
              <td>{lastService}</td>
              <td>{nextDue}</td>
              <td>{status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Active Alerts Card */}
    <div
      className="card"
      style={{
        borderRadius: "10px",
        padding: "20px",
        flex: "1",
        minWidth: "350px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center bg-danger">
        <h5 className="mb-0 bg-danger">Active Alerts</h5>
      </div>
      <hr />
      <div>
  {alerts.map((alert, idx) => (
  <div key={idx} className="card p-3 mb-3" style={{ borderRadius: "10px" }}>
    <h6 style={{ marginBottom: "4px" }}>{alert.title}</h6>
    <div style={{ fontSize: "14px", color: "#555" }}>{alert.description}</div>
    <div
      style={{
        fontSize: "13px",
        color: "#fff",
        backgroundColor: "skyblue",
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "5px",
        marginTop: "4px",
      }}
    >
      {alert.priority}
    </div>
    <br />

    {/* Conditionally render message or buttons */}
    {alert.trigger_status === 1 ? (
      <div
        style={{
          backgroundColor: "#cce5ff",
          color: "#004085",
          padding: "8px 12px",
          borderRadius: "5px",
          fontSize: "14px",
          marginTop: "8px",
        }}
      >
        ✅ Already Acknowledged
      </div>
    ) : alert.trigger_status === 2 ? (
      <div
        style={{
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "8px 12px",
          borderRadius: "5px",
          fontSize: "14px",
          marginTop: "8px",
        }}
      >
        👷 Already Assigned to Technician
      </div>
    ) : (
      <div className="d-flex mt-2">
        <button
          className="btn btn-sm btn-primary me-2"
          style={{ width: "110px", height: "35px", fontSize: "14px" }}
          onClick={() => handleAction(alert.id, 1, "Acknowledged")}
        >
          Acknowledge
        </button>
        <button
          className="btn btn-sm btn-success"
          style={{ width: "110px", height: "35px", fontSize: "14px" }}
          onClick={() => handleAction(alert.id, 2, "Technician Assigned")}
        >
          Assign Technician
        </button>
      </div>
    )}

    {/* Toast container for feedback */}
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      hideProgressBar
      closeOnClick
      pauseOnHover={false}
      draggable
    />
  </div>
))}


</div>


    </div>
  </div>
</div>
<div className="row" style={{ marginLeft: "5px" }}>
  {/* Left Column: Maintenance Request Form */}
   <div
        className="card p-4 col-md-6"
        style={{
          borderRadius: "10px",
          backgroundColor: "#cee4",
          marginLeft: "5px",
          height: "450px",
        }}
         ref={formRef}
      >
        <h5 className="mb-4">Maintenance Request</h5>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Machine</label>
            <select
              className="form-select"
              value={machine}
              onChange={(e) => setMachine(e.target.value)}
            >
              <option>Hydraulic Press #1</option>
              <option>Conveyor Belt #2</option>
              <option>Cooling Fan #3</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Issue Type</label>
            <select
              className="form-select"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
            >
              <option>Mechanical</option>
              <option>Electrical</option>
              <option>Software</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Problem Description</label>
          <textarea
            className="form-control"
            placeholder="Describe the issue..."
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label d-block mb-2">Urgency</label>
          {["Low", "Medium", "High"].map((level) => (
            <div className="form-check form-check-inline" key={level}>
              <input
                className="form-check-input"
                type="radio"
                name="urgency"
                id={level}
                value={level}
                checked={urgency === level}
                onChange={(e) => setUrgency(e.target.value)}
              />
              <label className="form-check-label" htmlFor={level}>
                {level}
              </label>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit Request
        </button>
      </div>
  
  {/* Right Column: Maintenance History Cards */}
  <div className="col-md-5" style={{ paddingLeft: "10px", marginTop: "20px", width: "430px" }}>
  <div className="maintenance-history">
    <h2>Maintenance History</h2>
    <ul>
      {maintenanceRecords.map((record, index) => (
        <li key={index} className="maintenance-item">
          <div className="left-info">
            <div className="machine-name">{record.machine}</div>
            <div className="task-name">{record.task}</div>
          </div>
          <div className="right-info">
            <div className="maintenance-date">{record.date}</div>
            <div className="status completed">{record.status}</div>
          </div>
        </li>
      ))}
    </ul>
  </div>

  {/* Machine Uptime Section */}
 <div className="machine-uptime card">
  <h3>Machine Uptime</h3>
  <div className="uptime-values">
    <span className="line-percent">98.2%</span>
    <span className="line-percent">92.7%</span>
    <span className="line-percent">87.4%</span>
  </div>
  <div className="uptime-labels">
    <span className="line-name">Line A</span>
    <span className="line-name">Line B</span>
    <span className="line-name">Line C</span>
  </div>
</div>


</div>

</div>


</>

  );
}
