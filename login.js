document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');

    try {
        const response = await fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.exito) {
            window.location.href = 'admin.html'; // Redirigir al panel
        } else {
            errorElement.textContent = data.error || 'Error desconocido';
        }
    } catch (error) {
        errorElement.textContent = 'Error de conexión';
        console.error('Error:', error);
    }
});