<!DOCTYPE html>
<html>
<head>
    <title>Edit Production Order</title>
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
        <h3 class="form-title">Edit Production Order</h3>
        <form method="POST" action="">
            <div class="row">
                <div class="col-md-6">
                    <!-- Left Column -->
                    <div class="form-group">
                        <label>Order Number</label>
                        <input type="text" class="form-control" name="order_number" value="<?= htmlspecialchars($order->order_number) ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Product Name</label>
                        <input type="text" class="form-control" name="product_name" value="<?= htmlspecialchars($order->product_name) ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Quantity</label>
                        <input type="number" class="form-control" name="quantity" value="<?= htmlspecialchars($order->quantity) ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Completed Quantity</label>
                        <input type="number" class="form-control" name="completed_quantity" value="<?= htmlspecialchars($order->completed_quantity) ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Progress</label>
                        <select class="form-control" name="progress" required>
                            <?php foreach ([0, 25, 50, 75, 100] as $value): ?>
                                <option value="<?= $value ?>" <?= $order->progress == $value ? 'selected' : '' ?>><?= $value ?>%</option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Deadline</label>
                        <input type="date" class="form-control" name="deadline" value="<?= htmlspecialchars($order->deadline) ?>" required>
                    </div>
                </div>

                <div class="col-md-6">
                    <!-- Right Column -->
                    <div class="form-group">
                        <label>Status</label>
                        <select class="form-control" name="status" required>
                            <?php foreach (['Pending', 'In Progress', 'Completed'] as $status): ?>
                                <option value="<?= $status ?>" <?= $order->status == $status ? 'selected' : '' ?>><?= $status ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Shift</label>
                        <select class="form-control" name="shift" required>
                            <?php foreach (['Morning', 'Evening', 'Night'] as $shift): ?>
                                <option value="<?= $shift ?>" <?= $order->shift == $shift ? 'selected' : '' ?>><?= $shift ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Notes</label>
                        <textarea class="form-control" name="notes" rows="3" required><?= htmlspecialchars($order->notes) ?></textarea>
                    </div>
                    <div class="form-group">
                        <label>Availability (%)</label>
                        <input type="number" class="form-control" name="availability" min="0" max="100" value="<?= htmlspecialchars($order->availability) ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Performance (%)</label>
                        <input type="number" class="form-control" name="performance" min="0" max="100" value="<?= htmlspecialchars($order->performance) ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Quality (%)</label>
                        <input type="number" class="form-control" name="quality" min="0" max="100" value="<?= htmlspecialchars($order->quality) ?>" required>
                    </div>
                    <div class="form-group">
                        <label>Units Produced</label>
                        <input type="number" class="form-control" name="units_produced" value="<?= htmlspecialchars($order->units_produced) ?>" required>
                    </div>
                </div>
            </div>

            <div class="text-right mt-4">
                <button type="submit" class="btn btn-primary">Update</button>
                <a href="<?= base_url('index.php/production/view/' . $order->id) ?>" class="btn btn-secondary">Cancel</a>
            </div>
        </form>
    </div>
</div>
</body>
</html>
