<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'conexion.php';

try {
    // Verificar sesión (implementa tu lógica de autenticación)
    session_start();
    if (!isset($_SESSION['usuario_id'])) {
        throw new Exception('Acceso no autorizado', 403);
    }

    $stmt = $conexion->query("SELECT * FROM reservaciones ORDER BY fecha_registro DESC");
    $reservaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'exito' => true,
        'reservaciones' => $reservaciones
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'exito' => false,
        'error' => $e->getMessage()
    ]);
}