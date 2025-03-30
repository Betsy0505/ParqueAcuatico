<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$servername = "localhost";
$username = "root"; // Usuario por defecto en XAMPP
$password = ""; // Contraseña por defecto en XAMPP
$dbname = "parque_aventura";

// Obtener datos del POST
$data = json_decode(file_get_contents('php://input'), true);

try {
    // Crear conexión
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Preparar SQL
    $stmt = $conn->prepare("INSERT INTO reservaciones (
        adultos, ninos, sillas, mesas, sombrillas, 
        espacio_campamento, renta_campamento_4, renta_campamento_8, 
        renta_campamento_12, cabana_4, cabana_6, total
    ) VALUES (
        :adultos, :ninos, :sillas, :mesas, :sombrillas, 
        :espacio_campamento, :renta_campamento_4, :renta_campamento_8, 
        :renta_campamento_12, :cabana_4, :cabana_6, :total
    )");

    // Bind parameters
    $stmt->bindParam(':adultos', $data['adultos']);
    $stmt->bindParam(':ninos', $data['ninos']);
    $stmt->bindParam(':sillas', $data['sillas']);
    $stmt->bindParam(':mesas', $data['mesas']);
    $stmt->bindParam(':sombrillas', $data['sombrillas']);
    $stmt->bindParam(':espacio_campamento', $data['espacio_campamento']);
    $stmt->bindParam(':renta_campamento_4', $data['renta_campamento_4']);
    $stmt->bindParam(':renta_campamento_8', $data['renta_campamento_8']);
    $stmt->bindParam(':renta_campamento_12', $data['renta_campamento_12']);
    $stmt->bindParam(':cabana_4', $data['cabana_4']);
    $stmt->bindParam(':cabana_6', $data['cabana_6']);
    $stmt->bindParam(':total', $data['total']);

    // Ejecutar
    $stmt->execute();

    echo json_encode([
        'exito' => true,
        'mensaje' => 'Reservación guardada correctamente'
    ]);

} catch(PDOException $e) {
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error al guardar: ' . $e->getMessage()
    ]);
}

$conn = null;
?>