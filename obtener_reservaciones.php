<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permitir cualquier origen

require 'conexion.php';

try {
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
        'error' => 'Error al obtener reservaciones: ' . $e->getMessage()
    ]);
}
?>