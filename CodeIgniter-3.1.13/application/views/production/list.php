<!DOCTYPE html>
<html>
<head>
    <title>Production Orders</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
<div class="container mt-5">
    <h3 class="mb-4">Production Orders</h3>

    <a href="<?= base_url('index.php/production/add'); ?>" class="btn btn-primary mb-3">Add New Order</a>

    <table class="table table-bordered table-striped">
        <thead class="thead-dark">
            <tr>
                <th>Order #</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Completed</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        <?php if (!empty($orders)): ?>
            <?php foreach($orders as $order): ?>
                <tr>
                    <td><?= $order->order_number; ?></td>
                    <td><?= $order->product_name; ?></td>
                    <td><?= $order->quantity; ?></td>
                    <td><?= $order->completed_quantity; ?></td>
                    <td><?= $order->progress; ?>%</td>
                    <td><?= $order->status; ?></td>
                    <td><?= $order->deadline; ?></td>
                    <td>
                        <a href="<?= base_url('index.php/production/edit/'.$order->id); ?>" class="btn btn-sm btn-warning">Edit</a>
                        <a href="<?= base_url('index.php/production/delete/'.$order->id); ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</a>
                        <a href="<?= base_url('index.php/production/view/'.$order->id); ?>" class="btn btn-sm btn-info">View</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php else: ?>
            <tr>
                <td colspan="8" class="text-center text-muted">No records found.</td>
            </tr>
        <?php endif; ?>
        </tbody>
    </table>
</div>
</body>
</html>
