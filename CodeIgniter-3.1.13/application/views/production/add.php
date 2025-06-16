<!DOCTYPE html>
<html>
<head>
    <title>Add Production Order</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .form-section {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .form-title {
            margin-bottom: 25px;
        }
    </style>
</head>
<body>
<div class="container mt-5">
    <div class="form-section">
        <h3 class="form-title">Add New Production Order</h3>
        <form method="POST" action="<?= base_url('index.php/production/add') ?>">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label>Order Number</label>
                        <input type="text" class="form-control" name="order_number" required>
                    </div>
                    <div class="form-group">
                        <label>Product Name</label>
                        <input type="text" class="form-control" name="product_name" required>
                    </div>
                    <div class="form-group">
                        <label>Quantity</label>
                        <input type="number" class="form-control" name="quantity" required>
                    </div>
                    <div class="form-group">
                        <label>Completed Quantity</label>
                        <input type="number" class="form-control" name="completed_quantity" required>
                    </div>
                    <div class="form-group">
                        <label>Progress</label>
                        <select class="form-control" name="progress" required>
                            <option value="">Select</option>
                            <option value="0">0%</option>
                            <option value="25">25%</option>
                            <option value="50">50%</option>
                            <option value="75">75%</option>
                            <option value="100">100%</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Deadline</label>
                        <input type="date" class="form-control" name="deadline" required>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group">
                        <label>Status</label>
                        <select class="form-control" name="status" required>
                            <option value="">Select</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Shift</label>
                        <select class="form-control" name="shift" required>
                            <option value="">Select</option>
                            <option value="Morning">Morning</option>
                            <option value="Evening">Evening</option>
                            <option value="Night">Night</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Notes</label>
                        <textarea class="form-control" name="notes" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Availability (%)</label>
                        <input type="number" class="form-control" name="availability" min="0" max="100" required>
                    </div>
                    <div class="form-group">
                        <label>Performance (%)</label>
                        <input type="number" class="form-control" name="performance" min="0" max="100" required>
                    </div>
                    <div class="form-group">
                        <label>Quality (%)</label>
                        <input type="number" class="form-control" name="quality" min="0" max="100" required>
                    </div>
                    <div class="form-group">
                        <label>Units Produced</label>
                        <input type="number" class="form-control" name="units_produced" required>
                    </div>
                </div>
            </div>

            <div class="text-right mt-4">
                <button type="submit" class="btn btn-primary">Save</button>
                <a href="<?= base_url('index.php/production/list') ?>" class="btn btn-secondary">Cancel</a>
            </div>
        </form>
    </div>
</div>
</body>
</html>
