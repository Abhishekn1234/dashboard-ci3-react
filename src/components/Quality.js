import { useState,useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Clipboard2CheckFill } from 'react-bootstrap-icons';
import QualityTrends from './Qualitytrends';
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Quality() {
  // Store original values for toggling
  const [defectDetails, setDefectDetails] = useState([]);
const [recentDefects, setRecentDefects] = useState([]);

const defectColors = {
  'Warping': 'red',
  'Adhesive Failure': 'yellow',
  'Surface Defects': 'lightblue',
};

useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch grouped defect counts for pie
      const countRes = await fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/defects/defect_counts");
      const countData = await countRes.json();

      const formatted = countData.map(defect => ({
        label: defect.defect_name,
        value: parseInt(defect.count),
        originalValue: parseInt(defect.count),
        color: defectColors[defect.defect_name] || 'gray',
        disabled: false
      }));

      setDefectDetails(formatted);

      // Fetch recent defects
      const recentRes = await fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/defects/recent");
      const recentData = await recentRes.json();

      setRecentDefects(recentData);
    } catch (err) {
      console.error("Error fetching defect data:", err);
    }
  };

  fetchData();
}, []);

  const chartData = {
    labels: defectDetails.map(d => d.label),
    datasets: [
      {
        data: defectDetails.map(d => d.disabled ? 0 : d.value),
        backgroundColor: defectDetails.map(d => d.color),
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    cutout: '60%',
    layout: { padding: 10 },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

 const toggleDefect = (index) => {
  const updated = [...defectDetails];
  const item = updated[index];

  item.disabled = !item.disabled;
  item.value = item.disabled ? 0 : item.originalValue;

  setDefectDetails(updated);
};

  const [formData, setFormData] = useState({
    defect_name: '',
    product_line: '',
    quantity: '',
    severity: '',
    shift: '',
    description: '',
    corrective_action: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
     const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/defects/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      alert(result.message);
      setFormData({
        defect_name: '',
        product_line: '',
        quantity: '',
        severity: '',
        shift: '',
        description: '',
        corrective_action: '',
      })
    } catch (error) {
      alert("Failed to submit defect");
      console.error(error);
    }
  };

  return (
    <>
  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
    {/* Quality Metrics Card */}
    <div
      className="card"
      style={{
        borderRadius: '10px',
        padding: '20px',
        height: '350px',
        width: '55%',
        margin: '5px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h5 className="mb-3 text-left">
        <Clipboard2CheckFill size={20} className="me-2 text-primary" />
        Quality Metrics
      </h5>
      <hr />

      {/* Custom Legend */}
      <div className="mb-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {defectDetails.map((defect, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: '#f8f9fa',
              padding: '4px 8px',
              borderRadius: '8px',
            }}
          >
            <span
              style={{
                width: '40px',
                height: '10px',
                backgroundColor: defect.color,
                display: 'inline-block',
                borderRadius: '5px',
              }}
            ></span>
            <small
              style={{
                fontSize: '13px',
                textDecoration: defect.disabled ? 'line-through' : 'none',
                color: defect.disabled ? '#888' : '#000',
              }}
            >
              {defect.label}
            </small>
            <span
              style={{
                cursor: 'pointer',
                marginLeft: '5px',
                fontWeight: 'bold',
                color: '#888',
              }}
              onClick={() => toggleDefect(idx)}
            >
              ×
            </span>
          </div>
        ))}
      </div>

      {/* Doughnut Chart */}
      <div style={{ height: '180px', width: '70%', margin: '0 auto' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>

    {/* Recent Defects Card */}
    <div
      className="card"
      style={{
        borderRadius: '10px',
        padding: '20px',
        height: '250px',
        width: '40%',
        margin: '5px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflowY: 'auto',
      }}
    >
      <h5 className="mb-3 text-left">
        <Clipboard2CheckFill size={20} className="me-2 text-danger" />
        Recent Defects
      </h5>
      <hr />
      <div style={{ border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
  {recentDefects.map((defect, index) => {
    // Define color based on severity or type (you can customize this logic)
    // Map severity to colors
const colorMap = {
  high: '#dc3545',    // red
  medium: '#fd7e14',  // orange
  low: '#198754'      // green
};

// Get dot color based on severity (case-insensitive safe)
const dotColor = colorMap[defect.severity?.toLowerCase()] || '#6c757d'; // fallback to gray

// Badge color based on defect count
const badgeColor = defect.count === 3
  ? '#dc3545' // red
  : defect.count === 2
  ? '#ffc107' // yellow
  : defect.count === 1
  ? '#0d6efd' // blue for low count
  : '#6c757d'; // gray as fallback


    return (
      <div key={index} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderBottom: '1px solid #eee',
        padding: '10px 15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: dotColor,
            marginRight: '10px'
          }}></div>
          <div>
            <span style={{ fontWeight: 'bold', backgroundColor: '#0d6efd', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>
              {defect.defect_name}
            </span>
            <span> - {defect.product_line}</span>
          </div>
        </div>
        <div style={{
          backgroundColor: badgeColor,
          color: '#000',
          borderRadius: '6px',
          fontWeight: 'bold',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {defect.count}
        </div>
      </div>
    );
  })}


      </div>
      
    </div>
   

    
  </div>
  <br/>
  <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // aligns top edges
    gap: '20px', // spacing between the two divs
    // flexWrap: 'nowrap', // optional, can omit if you want to prevent wrapping
  }}
>
  <div
    className="card"
    style={{
      padding: '20px',
      width: '55%',
      backgroundColor: '#cee4',
      boxSizing: 'border-box',
    }}
  >
   <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  🐜 Report New Defect
</h1>

    <hr />
    <div>
     <form onSubmit={handleSubmit}>
  <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
    {/* Defect Type */}
    <div style={{ flex: 1 }}>
      <label><strong>Defect Type</strong></label><br />
      <select name="defect_name" value={formData.defect_name} onChange={handleChange} style={{ width: '100%', padding: '6px' }}>
        <option value="">Select</option>
        <option>Wrapping</option>
        <option>Adhesive Failure</option>
        <option>Surface Defects</option>
      </select>
    </div>

    {/* Production Line */}
    <div style={{ flex: 1 }}>
      <label><strong>Production Line</strong></label><br />
      <select name="product_line" value={formData.product_line} onChange={handleChange} style={{ width: '100%', padding: '6px' }}>
        <option value="">Select</option>
        <option>Line A</option>
        <option>Line B</option>
        <option>Line C</option>
      </select>
    </div>
  </div>

  {/* Quantity, Severity, Shift */}
  <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
    <div style={{ flex: 1 }}>
      <label><strong>Quantity Affected</strong></label><br />
      <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="Enter quantity" style={{ width: '100%', padding: '6px' }} />
    </div>
    <div style={{ flex: 1 }}>
      <label><strong>Severity</strong></label><br />
      <select name="severity" value={formData.severity} onChange={handleChange} style={{ width: '100%', padding: '6px' }}>
        <option value="">Select</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>
    <div style={{ flex: 1 }}>
      <label><strong>Shift</strong></label><br />
      <select name="shift" value={formData.shift} onChange={handleChange} style={{ width: '100%', padding: '6px' }}>
        <option value="">Select</option>
        <option>Day</option>
        <option>Night</option>
      </select>
    </div>
  </div>

  {/* Description */}
  <div style={{ marginBottom: '15px' }}>
    <label><strong>Description</strong></label><br />
    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={{ width: '100%', padding: '6px' }}></textarea>
  </div>

  {/* Corrective Action */}
  <div style={{ marginBottom: '15px' }}>
    <label><strong>Corrective Action</strong></label><br />
    <textarea name="corrective_action" value={formData.corrective_action} onChange={handleChange} rows="3" style={{ width: '100%', padding: '6px' }}></textarea>
  </div>

  {/* Submit Button */}
  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '4px' }}>
    Submit
  </button>
</form>

    </div>
  </div>
  <div style={{ flex: '1 1 40%' }}>
    <QualityTrends />
  </div>
 
</div>
 

  </>
);
}