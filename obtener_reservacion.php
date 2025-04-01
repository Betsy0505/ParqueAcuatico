<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'conexion.php'; // Asegúrate de incluir tu archivo de conexión

try {
    if (!isset($_GET['id'])) {  // Aquí estaba el error - faltaba el paréntesis de cierre
        throw new Exception('ID de reservación no proporcionado');
    }

    $reservaId = filter_var($_GET['id'], FILTER_VALIDATE_INT);
    if (!$reservaId) {
        throw new Exception('ID de reservación inválido');
    }

    $stmt = $conexion->prepare("
        SELECT * FROM reservaciones 
        WHERE id = :id
    ");
    $stmt->execute([':id' => $reservaId]);
    $reserva = $stmt->fetch();

    if (!$reserva) {
        throw new Exception('Reservación no encontrada');
    }

    echo json_encode([
        'exito' => true,
        'reserva' => $reserva
    ]);

} catch (Exception $e) {
    echo json_encode([
        'exito' => false,
        'mensaje' => $e->getMessage()
    ]);
}
?>