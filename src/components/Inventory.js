import React ,{useState,useEffect}from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Inventory() {
  const [purchase, setPurchase] = useState({
    material: "Veneer Sheets",
    quantity: "",
    unit: "Pieces",
    supplier: "Supplier A",
    delivery_date: "",
  });

  const [transfer, setTransfer] = useState({
    material: "Veneer Sheets",
    quantity: "",
    unit: "Pieces",
    from_location: "Main Warehouse",
    to_location: "Production Line A",
  });
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    // Replace with your actual API endpoint
    axios.get("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/MaterialController/get_inventory")
      .then((res) => {
        setInventoryData(res.data);
      })
      .catch((err) => console.error("Error fetching inventory:", err));
  }, []);

  const getStockStatus = (qty) => {
    if (qty < 400) return { status: "Low", color: "warning", icon: "⚠️ Low stock" };
    if (qty < 1000) return { status: "Medium", color: "success", icon: "✔️ Sufficient stock" };
    return { status: "High", color: "danger", icon: "⚠️ Reorder needed" };
  };

  const handlePurchaseChange = (e) => {
    setPurchase({ ...purchase, [e.target.name]: e.target.value });
  };

  const handleTransferChange = (e) => {
    setTransfer({ ...transfer, [e.target.name]: e.target.value });
  };

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/MaterialController/add_purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchase),
      });
      const data = await res.json();
      alert(data.message || "Purchase Order Created");
      setPurchase({
     material: "",
    quantity: "",
    unit: "",
    supplier: "",
    delivery_date: "",
      })
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/MaterialController/add_transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transfer),
      });
      const data = await res.json();
      alert(data.message || "Material Transferred");
      setTransfer({
        material: "",
    quantity: "",
    unit: "",
    from_location: "",
    to_location: "",
      })
    } catch (err) {
      console.error(err);
    }
  };
 const chartData = {
  labels: inventoryData.map(item => item.item), // ← using `item` from API
  datasets: [
    {
      label: "Current Stock",
      data: inventoryData.map(item => parseFloat(item.quantity)),
      backgroundColor: [
        "#36A2EB", "#66D4A3", "#FFA726", "#B39DDB", "#B0BEC5",
        "#EF5350", "#26C6DA", "#9CCC65", "#FF7043", "#AB47BC"
      ].slice(0, inventoryData.length),
    },
  ],
};

console.log(inventoryData);

 const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 1600,         // Set the upper bound
      ticks: {
        stepSize: 200,   // Interval between ticks
      },
    },
  },
};



  return (
    <div className="p-4">
      {/* Top Section: Inventory Cards + Chart */}
      <Row className="mb-4">
        <Col md={4}>
          {inventoryData.map((item, index) => {
            const { status, color, icon } = getStockStatus(item.quantity);
            return (
              <Card key={index} className="mb-3 shadow-sm p-3">
                <Card.Body>
                  <h6>
                    {item.item}{" "}
                    <span className={`text-${color}`}>
                      {item.quantity}{item.unit === "kg" ? "kg" : ""}
                    </span>
                  </h6>
                  <small className={`text-${color}`}>{icon}</small>
                </Card.Body>
              </Card>
            );
          })}
        </Col>

        <Col md={8}>
          <Card className="shadow-sm p-3 h-100">
            <Card.Title>📊 Inventory Overview</Card.Title>
            <Bar data={chartData} options={chartOptions} height={150} />
          </Card>
        </Col>
      </Row>

      {/* Bottom Section: Purchase Order and Material Transfer */}
      <Row>
      {/* Purchase Order */}
      <Col md={6}>
        <Card className="shadow-sm p-3">
          <Card.Title>🛒 New Purchase Order</Card.Title>
          <Form onSubmit={handlePurchaseSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Material</Form.Label>
              <Form.Select name="material" value={purchase.material} onChange={handlePurchaseChange}>
                <option>Veneer Sheets</option>
                <option>Adhesive Resin</option>
                <option>Hardening Agent</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    name="quantity"
                    value={purchase.quantity}
                    onChange={handlePurchaseChange}
                    placeholder="Enter quantity"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Unit</Form.Label>
                  <Form.Select name="unit" value={purchase.unit} onChange={handlePurchaseChange}>
                    <option>Pieces</option>
                    <option>kg</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-2">
              <Form.Label>Supplier</Form.Label>
              <Form.Select name="supplier" value={purchase.supplier} onChange={handlePurchaseChange}>
                <option>Supplier A</option>
                <option>Supplier B</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Delivery Date</Form.Label>
              <Form.Control
                type="date"
                name="delivery_date"
                value={purchase.delivery_date}
                onChange={handlePurchaseChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Create Order
            </Button>
          </Form>
        </Card>
      </Col>

      {/* Material Transfer */}
      <Col md={6}>
        <Card className="shadow-sm p-3">
          <Card.Title>🔁 Material Transfer</Card.Title>
          <Form onSubmit={handleTransferSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Material</Form.Label>
              <Form.Select name="material" value={transfer.material} onChange={handleTransferChange}>
                <option>Veneer Sheets</option>
                <option>Adhesive Resin</option>
                <option>Hardening Agent</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    name="quantity"
                    value={transfer.quantity}
                    onChange={handleTransferChange}
                    placeholder="Enter quantity"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>Unit</Form.Label>
                  <Form.Select name="unit" value={transfer.unit} onChange={handleTransferChange}>
                    <option>Pieces</option>
                    <option>kg</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>From Location</Form.Label>
                  <Form.Select name="from_location" value={transfer.from_location} onChange={handleTransferChange}>
                    <option>Main Warehouse</option>
                    <option>Secondary Warehouse</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-2">
                  <Form.Label>To Location</Form.Label>
                  <Form.Select name="to_location" value={transfer.to_location} onChange={handleTransferChange}>
                    <option>Production Line A</option>
                    <option>Production Line B</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Button variant="info" type="submit">
              Transfer Material
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
    </div>
  );
}
