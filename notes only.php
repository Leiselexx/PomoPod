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

// Create notes table
$sqlCreateTable = "CREATE TABLE IF NOT EXISTS notes (
    title VARCHAR(40) PRIMARY KEY,
    note_text TEXT NOT NULL
)";

if ($conn->query($sqlCreateTable) === TRUE) {
    echo "Table 'notes' created successfully\n";
} else {
    echo "Error creating 'notes' table: " . $conn->error . "\n";
}

// Close connection
$conn->close();
?>
