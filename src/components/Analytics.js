import React,{useState,useEffect} from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { Card, Row, Col,Form,Button } from "react-bootstrap";
import { FaBalanceScale, FaCheckCircle, FaTimesCircle, FaTruck, FaTools } from "react-icons/fa";
import { FaChartPie, FaChartBar,FaFilter } from "react-icons/fa";
export default function Analytics() {
    const [series, setSeries] = useState([{ name: "Units Produced", data: [] }]);
    const [categories, setCategories] = useState([
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/Production/api_list");

        const orders = response.data;

        // Initialize monthly totals
        const monthlyTotals = {
          Jan: 0,
          Feb: 0,
          Mar: 0,
          Apr: 0,
          May: 0,
          Jun: 0,
        };

        // Accumulate quantity by month
        orders.forEach((order) => {
          const month = new Date(order.date).toLocaleString("default", { month: "short" }); // e.g., "Jan"
          if (monthlyTotals[month] !== undefined) {
            monthlyTotals[month] += parseInt(order.quantity);
          }
        });

        // Update chart data
        setSeries([{ name: "Units Produced", data: Object.values(monthlyTotals) }]);
      } catch (err) {
        console.error("Error fetching production data:", err);
      }
    };

    fetchData();
  }, []);
   const areaOptions = {
    chart: { id: "area-chart" },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    stroke: { curve: "smooth" },
    fill: { type: "gradient" }
  };
  
  const options = {
    chart: { id: "area-chart" },
    xaxis: {
      categories,
    },
    stroke: { curve: "smooth" },
    fill: { type: "gradient" },
    dataLabels: { enabled: false },
  };
  const pieOptions = {
    labels: ["Mechanical", "Electrical", "Material Shortage", "Calibration", "Software"],
    colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
    legend: { position: "top" }
  };
  const pieSeries = [30, 25, 20, 15, 10];

  const barOptions = {
    chart: { type: "bar", stacked: false, toolbar: { show: false } },
    xaxis: { categories: ["Line A", "Line B", "Line C"] },
    legend: { position: "top" },
    colors: ["#80DEEA", "#F48FB1"],
    plotOptions: { bar: { columnWidth: "50%" } }
  };
  const barSeries = [
    { name: "First Pass Yield", data: [92, 90, 88] },
    { name: "Defect Rate", data: [2, 3, 4] }
  ];

  const metrics = [
    {
      label: "First Pass Yield",
      value: "92.4%",
      icon: <FaCheckCircle />,
      color: "#28a745"
    },
    {
      label: "Defect Rate",
      value: "2.1%",
      icon: <FaTimesCircle />,
      color: "#dc3545"
    },
    {
      label: "On-Time Delivery",
      value: "96.3%",
      icon: <FaTruck />,
      color: "#17a2b8"
    },
    {
      label: "Maintenance Cost",
      value: "$12,450",
      icon: <FaTools />,
      color: "#ffc107"
    }
  ];

  return (
    <div style={{ padding: "15px" }}>
      {/* Top Row */}
      <Row className="mb-3">
        <Col md={8}>
          <Card style={{ height: "80%" }}>
            <Card.Body>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "0px" }}>
                <FaChartBar style={{ marginRight: "10px", color: "#007bff" }} />
                <h5 style={{ margin: 0 }}>Production Trends</h5>
              </div>
             <Chart options={options} series={series} type="area" height={300} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ height: "100%", padding: "10px" }}>
            <Card.Body style={{ padding: 0 }}>
              <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
                <FaBalanceScale style={{ marginRight: "10px", color: "#007bff" }} />
                <h5 style={{ margin: 0 }}>Key Metrics</h5>
              </div>
              <hr style={{ margin: 0 }} />
              <div style={{ padding: "10px" }}>
                {metrics.map((metric, idx) => (
                  <Card
                    key={idx}
                    style={{
                      backgroundColor: metric.color,
                      color: "white",
                      marginBottom: "12px",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <Card.Body style={{ padding: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>
                          {metric.icon}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "bold" }}>{metric.label}</div>
                          <div style={{ fontSize: "1.25rem", fontWeight: "600" }}>{metric.value}</div>
                          <div
                            style={{
                              height: "5px",
                              background: "rgba(255,255,255,0.3)",
                              marginTop: "8px",
                              borderRadius: "4px",
                              overflow: "hidden"
                            }}
                          >
                            <div
                              style={{
                                width: metric.label === "Defect Rate"
                                  ? "2.1%"
                                  : metric.label === "Maintenance Cost"
                                  ? "50%"
                                  : metric.value,
                                background: "white",
                                height: "100%"
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row */}
    <Row className="justify-content-start">
  {/* Downtime Analysis */}
  <Col md={4}>
    <Card style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <FaChartPie style={{ marginRight: "10px", color: "#007bff" }} />
        <h5 style={{ margin: 0 }}>Downtime Analysis</h5>
      </div>
      <Chart options={pieOptions} series={pieSeries} type="pie" height={300} />
    </Card>
  </Col>

  {/* Quality Metrics */}
  <Col md={4}>
    <Card style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <FaChartBar style={{ marginRight: "10px", color: "#007bff" }} />
        <h5 style={{ margin: 0 }}>Quality Metrics</h5>
      </div>
      <Chart options={barOptions} series={barSeries} type="bar" height={300} />
    </Card>
  </Col>

  {/* Filter Analytics */}
  <Col md={4}>
    <Card style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
        <FaFilter style={{ marginRight: "10px", color: "#007bff" }} />
        <h5 style={{ margin: 0 }}>Apply Filter</h5>
      </div>
      <hr />

      <Form>
        <Form.Group controlId="filterTimePeriod" style={{ marginBottom: "15px" }}>
          <Form.Label>Time Period</Form.Label>
          <Form.Control as="select">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>This Year</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="filterLines" style={{ marginBottom: "15px" }}>
          <Form.Label>All Lines</Form.Label>
          <Form.Control as="select">
            <option>All Lines</option>
            <option>Line A</option>
            <option>Line B</option>
            <option>Line C</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="filterProductType" style={{ marginBottom: "15px" }}>
          <Form.Label>Product Type</Form.Label>
          <Form.Control as="select">
            <option>All Products</option>
            <option>Product X</option>
            <option>Product Y</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="filterShifts" style={{ marginBottom: "15px" }}>
          <Form.Label>Shifts</Form.Label>
          <Form.Control as="select">
            <option>All Shifts</option>
            <option>Shift 1</option>
            <option>Shift 2</option>
            <option>Shift 3</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary">
          Apply Filter
        </Button>
      </Form>
    </Card>
  </Col>
</Row>


    </div>
  );
}