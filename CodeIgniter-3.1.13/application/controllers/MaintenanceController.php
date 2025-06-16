<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MaintenanceController extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->database(); // load DB library
    }
    public function schedule() {
    $query = $this->db->get('maintenance_requests');
    $requests = $query->result();

    $output = [];

    foreach ($requests as $row) {
        // Convert urgency to status
        $status = '';
        switch (strtolower($row->urgency)) {
            case 'low':
                $status = 'Down';
                break;
            case 'medium':
                $status = 'Operational';
                break;
            case 'high':
                $status = 'Needs Attention';
                break;
        }

        // Format the data
        $output[] = [
            'machine'      => $row->machine,
            'lastService'  => date('Y-m-d', strtotime($row->created_at)),
            'nextDue'      => date('Y-m-d', strtotime($row->created_at . ' +1 month')),
            'status'       => $status,
        ];
    }

    echo json_encode($output);
}
public function update_status()
{
    $data = json_decode(file_get_contents("php://input"), true);
    // print_r($data);
    if (!isset($data['id']) || !isset($data['trigger_status'])) {
        echo json_encode(['status' => 'error', 'message' => 'Missing data']);
        return;
    }

    // Check if record exists
    $this->db->where('id', $data['id']);
    $exists = $this->db->get('maintenance_requests')->row();

    if (!$exists) {
        echo json_encode(['status' => 'error', 'message' => 'Record not found']);
        return;
    }

    // Only update if value is different
    if ($exists->status == $data['trigger_status']) {
        echo json_encode(['status' => 'success', 'message' => 'No change needed']);
        return;
    }

    $this->db->where('id', $data['id']);
    $updated = $this->db->update('maintenance_requests', [
        'status' => $data['trigger_status']
    ]);

    if ($updated) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Update failed']);
    }
}

public function active()
{
    

    // Fetch alerts based on urgency from maintenance_requests
    $this->db->where_in('urgency', ['Low', 'Medium', 'High']);
    $query = $this->db->get('maintenance_requests');
    $results = $query->result();

    $alerts = [];

    foreach ($results as $row) {
        $alerts[] = [
            'id'=>$row->id,
            'title' => $row->machine,
            'description' => $row->description,
            'priority' => $row->urgency . ' ' . $row->issue_type
        ];
    }

    echo json_encode($alerts);
}

public function history()
{
    
    $query = $this->db->get('maintenance_requests');
    $records = $query->result();

    $output = [];

    foreach ($records as $row) {
        $status = (strtolower($row->urgency) === 'medium') ? 'Completed' : 'Incompleted';

        $output[] = [
            'machine' => $row->machine,
            'task' => $row->issue_type,
            'date' => date('Y-m-d', strtotime($row->created_at)),
            'status' => $status,
        ];
    }

    echo json_encode($output);
}
    public function submit_request() {
        // Get input from JSON
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            echo json_encode(["status" => "error", "message" => "Invalid or missing data"]);
            return;
        }

        // Sanitize and prepare data
        $machine     = isset($data['machine']) ? trim($data['machine']) : '';
        $issue_type  = isset($data['issue_type']) ? trim($data['issue_type']) : '';
        $description = isset($data['description']) ? trim($data['description']) : '';
        $urgency     = isset($data['urgency']) ? trim($data['urgency']) : '';

        // Validation (basic)
        if (empty($machine) || empty($issue_type) || empty($description) || empty($urgency)) {
            echo json_encode(["status" => "error", "message" => "All fields are required"]);
            return;
        }

        // Prepare insert array
        $insertData = [
            'machine'     => $machine,
            'issue_type'  => $issue_type,
            'description' => $description,
            'urgency'     => $urgency,
            'created_at'  => date('Y-m-d H:i:s')
        ];

        // Insert directly using DB
        $insert = $this->db->insert('maintenance_requests', $insertData);

        if ($insert) {
            echo json_encode(["status" => "success", "message" => "Maintenance request submitted successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to submit maintenance request"]);
        }
    }
}
