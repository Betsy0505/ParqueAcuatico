<?php
session_start();
session_destroy(); // Destruye toda la sesión

// Opcional: Limpiar cookies
setcookie('PHPSESSID', '', time() - 3600, '/');

// Respuesta JSON para AJAX o redirección directa
if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
} else {
    header('Location: index.html');
}
exit();
?>