<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));

        $task_name = $data->task_name;

        // Use prepared statements to prevent SQL injection
        $stmt = $conn->prepare('INSERT INTO tasks (task_name) VALUES (?)');
        $stmt->bind_param('s', $task_name);

        if ($stmt->execute()) {
            echo json_encode(['message' => 'Task added']);
        } else {
            echo json_encode(['message' => 'Task addition failed']);
        }

        $stmt->close();
        break;
    
    default:
        echo json_encode(['message' => 'Invalid request method']);
}

$conn->close();
?>
