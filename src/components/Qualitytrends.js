import React,{useState,useEffect} from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";



export default function QualityTrends() {
  const [data, setData] = useState([]);
const [fpy, setFpy] = useState(null);
useEffect(() => {
  const fetchFpy = async () => {
    try {
      const response = await fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/defects/fpy");
      const result = await response.json();
      setFpy(result.fpy);
    } catch (error) {
      console.error("Failed to fetch FPY", error);
    }
  };

  fetchFpy();
}, []);

  useEffect(() => {
    const fetchDefectRates = async () => {
      try {
        const response = await fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/defects/monthly_rates");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch defect rates", error);
      }
    };

    fetchDefectRates();
  }, []);
   return (
    <div className="container mt-4">
      <div className="row">
        <div className="card" style={{ width: '100%', marginBottom: '20px' }}>
          <div className="card-body">
            <h5 className="card-title">
              <i className="bi bi-bar-chart-line" style={{ marginRight: '8px' }}></i>
              Quality Trends
            </h5>
            <hr />
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 10]} label={{ value: 'Defect Rate %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="defectRate" fill="#ff6384" name="Defect Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card text-center" style={{ width: '100%', height: "200px" }}>
  <div className="card-body">
    <h5 className="card-title">First Pass Yield</h5>
    <h1 style={{ fontSize: '3rem', color: '#0d6efd' }}>
      {fpy !== null ? `${fpy}%` : 'Loading...'}
    </h1>
  </div>
</div>

      </div>
    </div>
  );
}


