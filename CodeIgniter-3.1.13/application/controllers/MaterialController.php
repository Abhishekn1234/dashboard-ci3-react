<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MaterialController extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper(['url', 'form']);
        
    }

    // ---------------- Purchase Orders -------------------

    public function add_purchase()
{
   
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
        return;
    }

    // Insert into purchase_orders table
    $this->db->insert('purchase_orders', [
        'material' => $data['material'],
        'quantity' => $data['quantity'],
        'unit' => $data['unit'],
        'supplier' => $data['supplier'],
        'delivery_date' => $data['delivery_date']
    ]);

    echo json_encode(["status" => "success", "message" => "Purchase order added."]);
}

    public function get_all_purchases() {
        $result = $this->db->get('purchase_orders')->result();
        echo json_encode($result);
    }
    public function get_inventory() {
        // Select specific columns
        $this->db->select('material AS item, quantity, unit');
        $query = $this->db->get('purchase_orders');
        $data = $query->result_array();

        echo json_encode($data);
    }

    public function get_purchase_by_id($id) {
        $result = $this->db->get_where('purchase_orders', ['id' => $id])->row();
        echo json_encode($result);
    }

    public function update_purchase($id) {
        $data = json_decode(file_get_contents("php://input"), true);

        $this->db->where('id', $id)->update('purchase_orders', [
            'material' => $data['material'],
            'quantity' => $data['quantity'],
            'unit' => $data['unit'],
            'supplier' => $data['supplier'],
            'delivery_date' => $data['delivery_date']
        ]);

        echo json_encode(["status" => "success", "message" => "Purchase order updated."]);
    }

    public function delete_purchase($id) {
        $this->db->delete('purchase_orders', ['id' => $id]);
        echo json_encode(["status" => "success", "message" => "Purchase order deleted."]);
    }

    // ---------------- Material Transfers -------------------

    public function add_transfer() {
        $data = json_decode(file_get_contents("php://input"), true);

        $this->db->insert('material_transfers', [
            'material' => $data['material'],
            'quantity' => $data['quantity'],
            'unit' => $data['unit'],
            'from_location' => $data['from_location'],
            'to_location' => $data['to_location']
        ]);

        echo json_encode(["status" => "success", "message" => "Material transfer recorded."]);
    }

    public function get_all_transfers() {
        $result = $this->db->get('material_transfers')->result();
        echo json_encode($result);
    }

    public function get_transfer_by_id($id) {
        $result = $this->db->get_where('material_transfers', ['id' => $id])->row();
        echo json_encode($result);
    }

    public function update_transfer($id) {
        $data = json_decode(file_get_contents("php://input"), true);

        $this->db->where('id', $id)->update('material_transfers', [
            'material' => $data['material'],
            'quantity' => $data['quantity'],
            'unit' => $data['unit'],
            'from_location' => $data['from_location'],
            'to_location' => $data['to_location']
        ]);

        echo json_encode(["status" => "success", "message" => "Material transfer updated."]);
    }

    public function delete_transfer($id) {
        $this->db->delete('material_transfers', ['id' => $id]);
        echo json_encode(["status" => "success", "message" => "Transfer deleted."]);
    }
}
