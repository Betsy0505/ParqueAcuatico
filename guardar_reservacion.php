<?php
// Configuración básica
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Validar método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Solo se acepta POST']));
}

// Obtener datos (para POST raw JSON)
$input = json_decode(file_get_contents('php://input'), true);

// Si viene como form-data
if (empty($input)) {
    $input = $_POST;
}

// Validar datos requeridos
if (empty($input['adultos'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Faltan datos requeridos']));
}

// SIMULACIÓN DE BASE DE DATOS (elimina esto cuando tengas MySQL configurado)
$response = [
    'success' => true,
    'message' => 'Datos recibidos (modo simulación)',
    'data' => $input
];

// En producción, reemplaza lo anterior con tu conexión MySQL real:
/*
$pdo = new PDO('mysql:host=localhost;dbname=parque_aventura', 'root', '');
$stmt = $pdo->prepare("INSERT INTO reservaciones (...) VALUES (...)");
$stmt->execute([...]);
*/

echo json_encode($response);
?>