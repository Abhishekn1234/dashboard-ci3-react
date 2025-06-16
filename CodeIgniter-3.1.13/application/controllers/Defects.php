<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Defects extends CI_Controller {

  public function __construct() {
    parent::__construct();
    $this->load->database();
  }

  // List all defects
  public function index() {
    $query = $this->db->get('defects');
    echo json_encode($query->result());
  }

  // Get defect by ID
  public function get($id) {
    $query = $this->db->get_where('defects', ['id' => $id]);
    echo json_encode($query->row());
  }

  // Add new defect
  public function add() {
    $data = json_decode(file_get_contents("php://input"), true);

    $insert = [
      'defect_name'       => $data['defect_name'],
      'product_line'      => $data['product_line'],
      'severity'          => $data['severity'],
      'shift'             => $data['shift'],
      'quantity'          => $data['quantity'],
      'description'       => $data['description'],
      'corrective_action' => $data['corrective_action']
    ];

    if ($this->db->insert('defects', $insert)) {
      echo json_encode(['status' => 'success', 'message' => 'Defect added']);
    } else {
      echo json_encode(['status' => 'error', 'message' => 'Failed to add defect']);
    }
  }

  // Update defect
  public function update($id) {
    $data = json_decode(file_get_contents("php://input"), true);

    $update = [
      'defect_name'       => $data['defect_name'],
      'product_line'      => $data['product_line'],
      'severity'          => $data['severity'],
      'shift'             => $data['shift'],
      'quantity'          => $data['quantity'],
      'description'       => $data['description'],
      'corrective_action' => $data['corrective_action']
    ];

    if ($this->db->where('id', $id)->update('defects', $update)) {
      echo json_encode(['status' => 'success', 'message' => 'Defect updated']);
    } else {
      echo json_encode(['status' => 'error', 'message' => 'Failed to update defect']);
    }
  }
  public function monthly_rates() {
    $this->load->database();
    $query = $this->db->query("
        SELECT DATE_FORMAT(created_at, '%b') AS month, 
               ROUND(SUM(quantity) / total.total_qty * 100, 1) AS defectRate
        FROM defects,
            (SELECT DATE_FORMAT(created_at, '%b') AS m, SUM(quantity) AS total_qty 
             FROM defects GROUP BY m) total
        WHERE DATE_FORMAT(created_at, '%b') = total.m
        GROUP BY month
        ORDER BY STR_TO_DATE(month, '%b')
    ");
    echo json_encode($query->result());
}
public function fpy() {
    $this->load->database();

    // Total defective units by severity
    $this->db->select("SUM(CASE WHEN severity IN ('low', 'medium', 'high') THEN quantity ELSE 0 END) as total_defects", false);
    $defectQuery = $this->db->get("defects");
    $defectRow = $defectQuery->row();
    $totalDefects = $defectRow->total_defects ?? 0;

    // You must define total production units. Example:
    // Let's say total units = defects + good units (e.g., you store separately, or assume a static total)
    // For now, assume a fake total for example:
    $totalUnits = 1000;

    $fpy = $totalUnits > 0 ? round((($totalUnits - $totalDefects) / $totalUnits) * 100, 1) : 0;

    echo json_encode(['fpy' => $fpy]);
}


   // GET total count of each defect type for chart
public function defect_counts() {
  $query = $this->db->select('defect_name, COUNT(*) as count')
                   ->group_by('defect_name')
                   ->get('defects');

  echo json_encode($query->result());
}

// GET recent defects sorted by time
public function recent() {
  $query = $this->db->order_by('created_at', 'DESC')
                   ->limit(10)
                   ->get('defects');
  echo json_encode($query->result());
}

  // Delete defect
  public function delete($id) {
    if ($this->db->delete('defects', ['id' => $id])) {
      echo json_encode(['status' => 'success', 'message' => 'Defect deleted']);
    } else {
      echo json_encode(['status' => 'error', 'message' => 'Failed to delete defect']);
    }
  }
}
