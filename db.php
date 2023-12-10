<?php

//MySQL Credentials
$servername = "localhost";
$username = "root";
$password = "danicadawn";
$dbname = "pomodb";  // Specify the desired database name

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database if not exists
$sqlCreateDB = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sqlCreateDB) === TRUE) {
    echo "Database created or already exists successfully\n";
} else {
    echo "Error creating database: " . $conn->error . "\n";
}

// Connect to the specific database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected to $dbname database successfully\n";

// Create tasks table
$sqlCreateTasksTable = "CREATE TABLE IF NOT EXISTS tasks (
    task_name TEXT NOT NULL
)";

if ($conn->query($sqlCreateTasksTable) === TRUE) {
    echo "Table 'tasks' created successfully\n";
} else {
    echo "Error creating 'tasks' table: " . $conn->error . "\n";
}

// Close connection
$conn->close();
?>
