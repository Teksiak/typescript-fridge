<?php

$conn = mysqli_connect("localhost", "root", "", "fridge");
$name = $_POST['name'];
$json_data = $_POST['jsondata'];
print_r($json_data);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
  }
  
  $sql = "UPDATE fridge SET json_data='$json_data' WHERE name='$name'";
  if (mysqli_query($conn, $sql)) {
    echo "Record updated successfully";
  } else {
    echo "Error updating record: " . mysqli_error($conn);
  }

mysqli_close($conn);

?>