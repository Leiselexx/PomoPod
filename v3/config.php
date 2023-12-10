<?php

//MySQL Credentials
$servername = "localhost";
$username = "root";
$password = "danicadawn";
$dbname = "pomodb";  // Specify the desired database name

// Connect to the specific database
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die ('ERROR: Could not connect.' . $conn->connect_error);
}

?>