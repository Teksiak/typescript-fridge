<?php

$link = mysqli_connect("localhost", "root", "", "fridge");
$query = "select name from fridge where name=?";
$name = $_POST['name'];
$stmt = mysqli_prepare($link, $query);
mysqli_stmt_bind_param($stmt, "s", $name);
mysqli_stmt_execute($stmt);
$res = mysqli_stmt_get_result($stmt);
$arr = mysqli_fetch_all($res, MYSQLI_ASSOC);

if (empty($arr)) {
    $json_data = json_encode('{"counter":0,"magnets":[]}');

    $sql = "INSERT INTO fridge (name,json_data) VALUES ('$name',$json_data)";
    if (mysqli_query($link, $sql)) { } 
    else { }
    $sql = "SELECT json_data from fridge where name=?";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, 's', $name);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    $data = mysqli_fetch_all($res, MYSQLI_ASSOC);
    echo json_encode($data[0]);
}
 else {
    $sql = "SELECT json_data from fridge where name=?";
    $stmt = mysqli_prepare($link, $sql);
    mysqli_stmt_bind_param($stmt, 's', $name);
    mysqli_stmt_execute($stmt);
    $res = mysqli_stmt_get_result($stmt);
    $data = mysqli_fetch_all($res, MYSQLI_ASSOC);
    echo json_encode($data[0]);
}
mysqli_query($link, "DELETE FROM fridge WHERE `fridge`.`name` = ''");


mysqli_close($link);

?>