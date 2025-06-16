<!DOCTYPE html>
<html>
<head>
    <title>Production Order Details</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
<div class="container mt-5">
    <h3>Production Order Details</h3>
    <table class="table table-bordered">
        <tr><th>Order Number</th><td><?= $order->order_number ?></td></tr>
        <tr><th>Product Name</th><td><?= $order->product_name ?></td></tr>
        <tr><th>Quantity</th><td><?= $order->quantity ?></td></tr>
        <tr><th>Completed</th><td><?= $order->completed_quantity ?></td></tr>
        <tr><th>Progress</th><td><?= $order->progress ?>%</td></tr>
        <tr><th>Status</th><td><?= $order->status ?></td></tr>
        <tr><th>Shift</th><td><?= $order->shift ?></td></tr>
        <tr><th>Deadline</th><td><?= $order->deadline ?></td></tr>
        <tr><th>Availability</th><td><?= $order->availability ?>%</td></tr>
        <tr><th>Performance</th><td><?= $order->performance ?>%</td></tr>
        <tr><th>Quality</th><td><?= $order->quality ?>%</td></tr>
        <tr><th>Units Produced</th><td><?= $order->units_produced ?></td></tr>
        <tr><th>Notes</th><td><?= nl2br(htmlspecialchars($order->notes)) ?></td></tr>
    </table>

    <h4 class="mt-5">Production Activities</h4>
    <?php if (empty($activities)): ?>
        <div class="alert alert-info">No activities recorded.</div>
    <?php else: ?>
        <table class="table table-striped">
            <thead><tr><th>#</th><th>Activity</th><th>Timestamp</th></tr></thead>
            <tbody>
                <?php foreach ($activities as $index => $a): ?>
                    <tr>
                        <td><?= $index + 1 ?></td>
                        <td><?= htmlspecialchars($a->activity) ?></td>
                        <td><?= $a->created_at ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>

    <h5 class="mt-4">Add Activity</h5>
    <form method="POST" action="<?= site_url('production/add_activity') ?>">
        <input type="hidden" name="order_id" value="<?= $order->id ?>">
        <div class="form-group">
            <textarea name="activity" class="form-control" placeholder="Activity description..." required></textarea>
        </div>
        <button type="submit" class="btn btn-success">Add Activity</button>
    </form>

    <div class="mt-4">
        <a href="<?= site_url('production/list') ?>" class="btn btn-secondary">Back to Orders</a>
        <a href="<?= site_url('production/edit/' . $order->id) ?>" class="btn btn-warning">Edit Order</a>
    </div>
</div>
</body>
</html>
