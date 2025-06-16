import React, { useState,useEffect } from "react";
import { Table, Button,Card,ProgressBar,Form,Modal,Row,Col } from "react-bootstrap";
import { ClipboardData, Eye, PencilSquare,Gear,List,Trash } from "react-bootstrap-icons";
import axios from 'axios';


export default function Production(){
    const [orders, setOrders] = useState([]);
    const [editingOrderId, setEditingOrderId] = useState(null);
     const [showEditForm, setShowEditForm] = useState(false);
   useEffect(() => {
  fetchOrders();
}, []);
const handleView = (order) => {
  // set selected order and show view modal
  console.log("Viewing", order);
};

const handleEdit = (order) => {
  setFormData({
    id: order.id, // <-- Add this
    orderNumber: order.order_number,
    productionLine: order.productline,
    completedQuantity: order.completed_quantity,
    status: order.status,
    shift: order.shift,
    notes: order.notes
  });
  setShowEditForm(true);
};
const handleUpdateSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `http://localhost/express/backend/CodeIgniter-3.1.13/index.php/production/edit/${formData.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );

    const result = await response.text(); // CI3 may not return JSON on redirect
    alert("Production order updated successfully!");
    setShowEditForm(false);
    // optionally refresh list or data
  } catch (err) {
    console.error("Error updating order:", err);
    alert("Failed to update production order.");
  }
};

useEffect(() => {
  if (!orders || orders.length === 0) {
    setLastOrderNumber(0); // So next becomes WO-001
    return;
  }

  const maxOrder = Math.max(
    ...orders.map(order => {
      const numberPart = parseInt(order.order_number.replace('WO-', ''));
      return isNaN(numberPart) ? 0 : numberPart;
    })
  );

  setLastOrderNumber(maxOrder);
}, [orders]);




const fetchOrders = async () => {
  try {
    const response = await fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/production/api_list");
    const data = await response.json();
    setOrders(data);
  } catch (err) {
    console.error("Failed to fetch orders", err);
  }
};

  const [showModal, setShowModal] = useState(false);
const [formData, setFormData] = useState({
  orderNumber: '',
  productName: "",
  productionLine: 'Line A',
  completedQuantity: '',
  status: 'In Progress',
  shift: 'Day Shift',
  notes: ''
});
const [lastOrderNumber, setLastOrderNumber] = useState(0);

useEffect(() => {
  if (showModal) {
    const nextOrder = String(lastOrderNumber + 1).padStart(3, '0');
    setFormData(prev => ({ ...prev, orderNumber: `WO-${nextOrder}` }));
  }
}, [showModal, lastOrderNumber]);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

const [unitsProducedToday, setUnitsProducedToday] = useState(0);

useEffect(() => {
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const totalToday = orders
    .filter(order => order.updated_at?.startsWith(today))
    .reduce((sum, order) => sum + parseInt(order.completed_quantity || 0), 0);

  setUnitsProducedToday(totalToday);
}, [orders]);
const [oee, setOee] = useState({ availability: 0, performance: 0, quality: 0, overall: 0 });

useEffect(() => {
  if (orders.length === 0) return;

  let totalAvailability = 0;
  let totalPerformance = 0;
  let totalQuality = 0;
  let count = 0;

  orders.forEach(order => {
    const avail = parseFloat(order.availability || 0);
    const perf = parseFloat(order.performance || 0);
    const qual = parseFloat(order.quality || 0);

    if (avail && perf && qual) {
      totalAvailability += avail;
      totalPerformance += perf;
      totalQuality += qual;
      count++;
    }
  });

  if (count > 0) {
    const avgAvailability = totalAvailability / count;
    const avgPerformance = totalPerformance / count;
    const avgQuality = totalQuality / count;

    const overall = (avgAvailability * avgPerformance * avgQuality) / 10000;

    setOee({
      availability: avgAvailability.toFixed(1),
      performance: avgPerformance.toFixed(1),
      quality: avgQuality.toFixed(1),
      overall: overall.toFixed(1)
    });
  }
}, [orders]);
const [recentActivities, setRecentActivities] = useState([]);
const groupProductionByDate = (orders) => {
  const map = {};
  orders.forEach(order => {
    const date = new Date(order.created_at).toISOString().split("T")[0];
    const units = parseInt(order.units_produced) || 0;
    if (!map[date]) map[date] = 0;
    map[date] += units;
  });
  return map;
};

const getDailyTrend = (productionMap) => {
  const dates = Object.keys(productionMap).sort();
  const trend = [];

  for (let i = 1; i < dates.length; i++) {
    const currentDate = dates[i];
    const previousDate = dates[i - 1];
    const currentUnits = productionMap[currentDate];
    const previousUnits = productionMap[previousDate];

    const change = previousUnits > 0 
      ? ((currentUnits - previousUnits) / previousUnits) * 100 
      : null;

    trend.push({
      date: currentDate,
      units: currentUnits,
      change,
    });
  }

  return trend;
};

const productionMap = groupProductionByDate(orders);
const dailyTrend = getDailyTrend(productionMap);



useEffect(() => {
  const completedOrders = orders
    .filter(order => order.status === "Completed" && order.created_at) // make sure updated_at exists
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
            .map(order => {
        const createdAt = new Date(order.created_at);

        const time = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const message = `Order ${order.order_number} completed at ${time} on ${createdAt.toLocaleDateString()}`;

        return { orderNumber: order.order_number, time, date: createdAt.toLocaleDateString(), message };
        });

  setRecentActivities(completedOrders);
}, [orders]);


const handleSubmit = async () => {
  try {
    const response = await fetch("http://localhost/express/backend/CodeIgniter-3.1.13/index.php/production/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
    body: JSON.stringify({
        order_number: formData.orderNumber,
        product_name: formData.productName || 'Default Product',
        quantity: formData.quantity || 0,
        completed_quantity: formData.completedQuantity || 0,
        progress: formData.progress || 0,
        deadline: formData.deadline || '2025-06-30',
        status: formData.status,
        shift: formData.shift,
        notes: formData.notes,
        availability: formData.availability || 0,
        performance: formData.performance || 0,
        quality: formData.quality || 0,
        units_produced: formData.unitsProduced || 0,
        productline: formData.productionLine || 'Line A' // Add this line
        })

    });

    if (response.ok) {
      const newOrder = await response.json(); // return inserted order from PHP
      setOrders((prev) => [...prev, newOrder]); // update UI
      setShowModal(false);
      setFormData({  // reset form
        orderNumber: '',
        productionLine: 'Line A',
        completedQuantity: '',
        status: 'In Progress',
        shift: 'Day Shift',
        notes: ''
      });
       const currentNumber = parseInt(formData.orderNumber.replace('WO-', ''));
  setLastOrderNumber(currentNumber);
  

  setShowModal(false); // Close modal
    } else {
      console.error("Failed to add order");
    }
  } catch (err) {
    console.error("Error:", err);
  }
};


    return(
        <>
        <div className="row">
            {/* Left side - Production Schedule */}
            <div className="col-md-7 mb-3">
                 <div
      className="card"
      style={{
        borderRadius: "0px",
        width: "100%",
        marginLeft: "10px",
        height: "300px",
      }}
    >
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex">
            <ClipboardData size={20} className="me-2 text-primary" />
            <h6 className="mb-0">Production Schedule</h6>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            + Add Order
            </Button>

        </div>

        <hr className="my-2" />

        
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <Table striped bordered hover size="sm" className="mb-0">
                    <thead>
                        <tr>
                        <th>Order #</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Progress</th>
                        <th>Deadline</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr key={order.id}>
                            <td>{order.order_number}</td>
                            <td>{order.product_name}</td>
                            <td>{order.quantity}</td>
                            <td>{order.progress}%</td>
                            <td>{order.deadline}</td>
                            <td>
                                <Button
                                size="sm"
                                variant="outline-info"
                                className="me-2"
                                onClick={() => handleView(order)}
                                title="View"
                                >
                                <Eye size={16} />
                                </Button>
                                <Button
                                size="sm"
                                variant="outline-secondary"
                                className="me-2"
                                onClick={() => handleEdit(order)}
                                title="Edit"
                                >
                                <PencilSquare size={16} />
                                </Button>
                                            

                                
                            </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                            Loading or No orders found.
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </Table>

                    </div>
                </div>
                </div>
                <br/>
                <div className="col-12">
                    <div className="card" style={{ borderRadius: "0px", marginLeft:"10px", width:"98%", height:"430px", backgroundColor:"#cee4"}}>
                            <div className="card-body">
                                
                            <h6 className="mb-3"> <PencilSquare size={16} /> Update Production Order</h6>
                            <hr/>
                           <form onSubmit={handleUpdateSubmit}>

  
                            <div className="row mb-3">
                                <div className="col">
                                <label htmlFor="orderNumber" className="form-label">Order Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="orderNumber"
                                    name="orderNumber"
                                    value={formData.orderNumber}
                                    onChange={handleChange}
                                    readOnly // Usually order number is not editable
                                />
                                </div>
                                <div className="col">
                                <label htmlFor="productionLine" className="form-label">Production Line</label>
                                <select
                                    className="form-select"
                                    id="productionLine"
                                    name="productionLine"
                                    value={formData.productionLine}
                                    onChange={handleChange}
                                >
                                    <option value="Line A">Line A</option>
                                    <option value="Line B">Line B</option>
                                    <option value="Line C">Line C</option>
                                </select>
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="row mb-3">
                                <div className="col">
                                <label htmlFor="completedQuantity" className="form-label">Completed Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="completedQuantity"
                                    name="completedQuantity"
                                    value={formData.completedQuantity}
                                    onChange={handleChange}
                                    min={0}
                                />
                                </div>
                                <div className="col">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option>Not Started</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                    <option>On Hold</option>
                                </select>
                                </div>
                                <div className="col">
                                <label htmlFor="shift" className="form-label">Shift</label>
                                <select
                                    className="form-select"
                                    id="shift"
                                    name="shift"
                                    value={formData.shift}
                                    onChange={handleChange}
                                >
                                    <option>Day Shift</option>
                                    <option>Night Shift</option>
                                    <option>Evening Shift</option>
                                </select>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="mb-3">
                                <label htmlFor="notes" className="form-label">Notes</label>
                                <textarea
                                className="form-control"
                                id="notes"
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleChange}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-success">Update Progress</button>
                            </form>

                            </div>
                        </div>
                </div>
            </div>

    
        <div className="col-md-5 mb-3 d-flex flex-column align-items-end">
        {/* First Card */}
        <Card style={{ width: "600px", height: "100px", borderRadius: "8px", marginBottom: "15px", marginRight: "20px", backgroundColor: "white" }}>
            <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Overall Equipment Effectiveness {oee.overall}%</h6>
                <Gear size={20} style={{ cursor: "pointer" }} />
            </div>
            <ProgressBar now={parseFloat(oee.overall)} className="mb-2" />
            <div className="d-flex">
                <div style={{ flex: 1, textAlign: "left" }}>
                <small>Availability {oee.availability}%</small>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                <small>Performance {oee.performance}%</small>
                </div>
                <div style={{ flex: 1, textAlign: "right" }}>
                <small>Quality {oee.quality}%</small>
                </div>
            </div>
            </Card.Body>
        </Card>

        {/* Second Card (below the first one) */}
        <Card style={{ width: "600px", height: "100px", borderRadius: "8px", marginRight: "20px", backgroundColor: "white",marginBottom:"120px" }}>
            <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">
               <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{unitsProducedToday}</span>
                <small>{unitsProducedToday > 1000 ? "Above target" : "Below target"}</small>

                </h6>

                <Gear size={20} style={{ cursor: "pointer" }} />
            </div>
            
            <div className="d-flex">
                
                
                <div style={{ flex: 1, textAlign: "left" }}>
 {dailyTrend.length === 0 ? (
      <p style={{ fontSize: '12px' }}>No data available</p>
    ) : (
      <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
        {dailyTrend.map((day, idx) => (
          <li key={idx} className="d-flex justify-content-between" style={{ fontSize: '13px', padding: '4px 0' }}>
            <span>{day.date}</span>
            <span>{day.units} units</span>
            {day.change !== null ? (
              <span style={{ color: day.change > 0 ? 'green' : 'red' }}>
                {day.change > 0 ? '↑' : '↓'} {Math.abs(day.change).toFixed(1)}%
              </span>
            ) : (
              <span style={{ color: 'gray' }}>N/A</span>
            )}
          </li>
        ))}
      </ul>
    )}
</div>

            </div>
            </Card.Body>
        </Card>
        <Card style={{ width: "600px", height: "400px", borderRadius: "8px", marginRight: "20px", backgroundColor: "white" }}>
            <div className="d-flex">
            <List size={24} color="black" />
            <h3 style={{color:"blue",fontSize:"22px",marginLeft:"10px"}}>Recent Activities</h3>
            </div>
            <hr/>
            {recentActivities.map((activity, index) => (
  <ul key={index} style={{ listStyle: 'none', paddingLeft: '20px', display: 'flex' }}>
    <li style={{ color: 'black', display: 'flex' }}>
      <span style={{ color: 'lightblue', marginRight: '8px', fontSize: '23px' }}>•</span>
      <div>
        <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>{activity.time}</p>
        <p style={{ color: 'black', fontSize: '13px', margin: 0 }}>{activity.message}</p>
      </div>
    </li>
  </ul>
))}



        </Card>
        </div>

        </div>
       <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Add Production Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="productionLine">
                <Form.Label>Production Line</Form.Label>
                <Form.Control
                    as="select"
                    name="productionLine"
                    value={formData.productionLine}
                    onChange={handleChange}
                >
                    <option value="">Select Line</option>
                    <option value="Line A">Line A</option>
                    <option value="Line B">Line B</option>
                    <option value="Line C">Line C</option>
                </Form.Control>
                </Form.Group>

            <Row>
                <Col md={6}>
                <Form.Group>
                    <Form.Label>Order Number</Form.Label>
                    <Form.Control
                    type="text"
                    name="orderNumber"
                    value={formData.orderNumber}
                    readOnly
                    />
                </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group>
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="e.g., Cement Bag 50KG"
                    />
                </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                <Form.Group>
                    <Form.Label>Total Quantity</Form.Label>
                    <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g., 1000"
                    />
                </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group>
                    <Form.Label>Completed Quantity</Form.Label>
                    <Form.Control
                    type="number"
                    name="completedQuantity"
                    value={formData.completedQuantity}
                    onChange={handleChange}
                    />
                </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                <Form.Group>
                    <Form.Label>Progress (%)</Form.Label>
                    <Form.Control
                    type="number"
                    name="progress"
                    value={formData.progress}
                    onChange={handleChange}
                    placeholder="e.g., 75"
                    />
                </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group>
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    />
                </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                    as="select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    >
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>On Hold</option>
                    </Form.Control>
                </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group>
                    <Form.Label>Shift</Form.Label>
                    <Form.Control
                    as="select"
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    >
                    <option>Day Shift</option>
                    <option>Night Shift</option>
                    </Form.Control>
                </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                <Form.Group>
                    <Form.Label>Availability (%)</Form.Label>
                    <Form.Control
                    type="number"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    />
                </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group>
                    <Form.Label>Performance (%)</Form.Label>
                    <Form.Control
                    type="number"
                    name="performance"
                    value={formData.performance}
                    onChange={handleChange}
                    />
                </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                <Form.Group>
                    <Form.Label>Quality (%)</Form.Label>
                    <Form.Control
                    type="number"
                    name="quality"
                    value={formData.quality}
                    onChange={handleChange}
                    />
                </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group>
                    <Form.Label>Units Produced</Form.Label>
                    <Form.Control
                    type="number"
                    name="unitsProduced"
                    value={formData.unitsProduced}
                    onChange={handleChange}
                    />
                </Form.Group>
                </Col>
            </Row>

            <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Running smoothly, no issues"
                />
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
            Save Order
            </Button>
        </Modal.Footer>
        </Modal>


        </>
    )
}