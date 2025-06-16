<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Production extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->database(); // Load database directly
        $this->load->helper(['url', 'form']);
    }
    public function api_list() {
    header('Content-Type: application/json');
    $orders = $this->db->get('production_orders')->result();
    echo json_encode($orders);
}

    // Show all production orders
    public function list() {
        $query = $this->db->get('production_orders');
        $data['orders'] = $query->result();

        $this->load->view('production/list', $data);
    }

    // View a single production order
    public function view($id) {
        $data['order'] = $this->db->get_where('production_orders', ['id' => $id])->row();
        $data['activities'] = $this->db->get_where('production_activities', ['order_id' => $id])->result();

        $this->load->view('production/view', $data);
    }

    // Add new production order
   public function add() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);

        $data = [
            'order_number' => $input['order_number'],
            'product_name' => $input['product_name'],
            'quantity' => $input['quantity'],
            'completed_quantity' => $input['completed_quantity'],
            'progress' => $input['progress'],
            'deadline' => $input['deadline'],
            'status' => $input['status'],
            'shift' => $input['shift'],
            'notes' => $input['notes'],
            'availability' => $input['availability'],
            'performance' => $input['performance'],
            'quality' => $input['quality'],
            'units_produced' => $input['units_produced'],
            'productline'=>$input['productline']
        ];

        $this->db->insert('production_orders', $data);
        $id = $this->db->insert_id();

        // Return the newly created order
        $newOrder = $this->db->get_where('production_orders', ['id' => $id])->row();
        echo json_encode($newOrder);
    }
}


    // Edit a production order
   public function edit($id) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);

        $updateData = [
            'order_number' => $data['orderNumber'],
            'productline' => $data['productionLine'],
            'completed_quantity' => $data['completedQuantity'],
            'status' => $data['status'],
            'shift' => $data['shift'],
            'notes' => $data['notes']
        ];

        $this->db->where('id', $id)->update('production_orders', $updateData);
        echo json_encode(['message' => 'Production order updated successfully']);
    } else {
        $data['order'] = $this->db->get_where('production_orders', ['id' => $id])->row();
        $this->load->view('production/edit', $data);
    }
}


    // Delete a production order
    public function delete($id) {
    if ($this->input->method() === 'delete') {
        $this->db->delete('production_orders', ['id' => $id]);
        $this->db->delete('production_activities', ['order_id' => $id]);
        echo json_encode(['status' => 'success']);
    } else {
        show_404();
    }
   }
    

    // Add activity for an order
    public function add_activity() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = [
                'order_id' => $this->input->post('order_id'),
                'activity' => $this->input->post('activity'),
                'created_at' => date('Y-m-d H:i:s')
            ];

            $this->db->insert('production_activities', $data);
            redirect('production/view/' . $data['order_id']);
        }
    }

    // Optional: Ajax endpoint for listing OEE per order
    public function effectiveness($id = null) {
    if ($id === null) {
        echo json_encode(['error' => 'No order ID provided']);
        return;
    }

    $order = $this->db->get_where('production_orders', ['id' => $id])->row();

    if ($order) {
        $oee = ($order->availability * $order->performance * $order->quality) / 10000;
        echo json_encode([
            'OEE' => round($oee, 2),
            'Availability' => $order->availability,
            'Performance' => $order->performance,
            'Quality' => $order->quality
        ]);
    } else {
        echo json_encode(['error' => 'Order not found']);
    }
}

}  