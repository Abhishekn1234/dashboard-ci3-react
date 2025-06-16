<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Products extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper(['url', 'form']);
        $this->load->library('form_validation');

        // CORS headers for API requests
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Content-Type");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0); // Handle preflight
        }
    }

    // Fetch all products (GET)
    public function index() {
        $query = $this->db->get('products');
        echo json_encode($query->result());
    }

    // Fetch a single product by ID (GET)
    public function view($id) {
        $product = $this->db->get_where('products', ['id' => $id])->row();
        if ($product) {
            echo json_encode($product);
        } else {
            echo json_encode(['error' => 'Product not found']);
        }
    }

    // Add a new product (POST)
    public function add() {
        $input = json_decode(file_get_contents('php://input'), true);

        if ($input) {
            $data = [
                'name' => $input['name'] ?? '',
                'price' => $input['price'] ?? 0,
                'stock' => $input['stock'] ?? 0,
                'category' => $input['category'] ?? '',
                'description' => $input['description'] ?? ''
            ];

            $this->db->insert('products', $data);
            echo json_encode(['success' => true, 'message' => 'Product added']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid input']);
        }
    }

    // Update product by ID (PUT)
    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);

        if ($input) {
            $data = [
                'name' => $input['name'] ?? '',
                'price' => $input['price'] ?? 0,
                'stock' => $input['stock'] ?? 0,
                'category' => $input['category'] ?? '',
                'description' => $input['description'] ?? ''
            ];

            $this->db->where('id', $id)->update('products', $data);
            echo json_encode(['success' => true, 'message' => 'Product updated']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid input']);
        }
    }

    // Delete product by ID (DELETE)
    public function delete($id) {
        $deleted = $this->db->delete('products', ['id' => $id]);
        if ($deleted) {
            echo json_encode(['success' => true, 'message' => 'Product deleted']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Delete failed']);
        }
    }
}
