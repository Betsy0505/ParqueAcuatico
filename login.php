<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'conexion.php'; // Archivo con la conexión a DB

try {
    $datos = json_decode(file_get_contents('php://input'), true);
    
    if (empty($datos['username']) || empty($datos['password'])) {
        throw new Exception('Usuario y contraseña requeridos');
    }

    $stmt = $conexion->prepare("SELECT id, username, password, nombre FROM usuarios WHERE username = ?");
    $stmt->execute([$datos['username']]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    // Cambio clave: Comparación directa (¡Texto plano!)
    if (!$usuario || $datos['password'] !== $usuario['password']) {
        throw new Exception('Credenciales incorrectas');
    }

    // Iniciar sesión
    session_start();
    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_nombre'] = $usuario['nombre'];

    echo json_encode([
        'exito' => true,
        'nombre' => $usuario['nombre']
    ]);

} catch (Exception $e) {
    http_response_code(401);
    echo json_encode([
        'exito' => false,
        'error' => $e->getMessage()
    ]);
}