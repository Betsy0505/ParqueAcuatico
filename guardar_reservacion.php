<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Desactivar visualización de errores en producción
ini_set('display_errors', 0);
ini_set('html_errors', 0);

require 'conexion.php';

try {
    // Validar método HTTP
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido', 405);
    }

    // Validar campos requeridos
    $camposRequeridos = ['adultos', 'ninos', 'total'];
    foreach ($camposRequeridos as $campo) {
        if (!isset($_POST[$campo])) {
            throw new Exception("El campo '$campo' es requerido", 400);
        }
    }

    // Preparar datos para la inserción
    $datos = [
        ':adultos' => (int)$_POST['adultos'],
        ':ninos' => (int)$_POST['ninos'],
        ':sillas' => (int)($_POST['sillas'] ?? 0),
        ':mesas' => (int)($_POST['mesas'] ?? 0),
        ':sombrillas' => (int)($_POST['sombrillas'] ?? 0),
        ':espacio_campamento' => (int)($_POST['espacio_campamento'] ?? 0),
        ':renta_campamento_4' => (int)($_POST['renta_campamento_4'] ?? 0),
        ':renta_campamento_8' => (int)($_POST['renta_campamento_8'] ?? 0),
        ':renta_campamento_12' => (int)($_POST['renta_campamento_12'] ?? 0),
        ':cabana_4' => (int)($_POST['cabana_4'] ?? 0),
        ':cabana_6' => (int)($_POST['cabana_6'] ?? 0),
        ':total' => (float)$_POST['total']
    ];

    // Consulta SQL completa con todos los campos
    $sql = "INSERT INTO reservaciones (
        adultos, ninos, sillas, mesas, sombrillas,
        espacio_campamento, renta_campamento_4, renta_campamento_8,
        renta_campamento_12, cabana_4, cabana_6, total, fecha_registro
    ) VALUES (
        :adultos, :ninos, :sillas, :mesas, :sombrillas,
        :espacio_campamento, :renta_campamento_4, :renta_campamento_8,
        :renta_campamento_12, :cabana_4, :cabana_6, :total, NOW()
    )";

    $stmt = $conexion->prepare($sql);
    
    if (!$stmt->execute($datos)) {
        throw new Exception('Error al guardar la reservación', 500);
    }

    // Respuesta JSON exitosa
    echo json_encode([
        'exito' => true,
        'id' => $conexion->lastInsertId(),
        'mensaje' => 'Reservación registrada con éxito'
    ]);
    exit();

} catch (PDOException $e) {
    // Error específico de PDO/SQL
    http_response_code(500);
    echo json_encode([
        'exito' => false,
        'error' => 'Error en la base de datos: ' . $e->getMessage()
    ]);
    exit();
} catch (Exception $e) {
    // Otros errores
    http_response_code($e->getCode() ?: 400);
    echo json_encode([
        'exito' => false,
        'error' => $e->getMessage()
    ]);
    exit();
}
?>