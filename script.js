document.getElementById('btnComprar'),addEventListener('click', function() {
    const datos = {
        adultos: document.getElementById('adulto').value || 0,
        ninos: document.getElementById('niño').value || 0,
        sillas: document.getElementById('silla').value || 0,
        mesas: document.getElementById('mesa').value || 0,
        sombrillas: document.getElementById('sombrilla').value || 0,
        espacio_campamento: document.getElementById('espacio1').value || 0,
        renta_campamento_4: document.getElementById('espacio2').value || 0,
        renta_campamento_8: document.getElementById('espacio3').value || 0,
        renta_campamento_12: document.getElementById('espacio4').value || 0,
        cabana_4: document.getElementById('espacio5').value || 0,
        cabana_6: document.getElementById('espacio6').value || 0,
        total: document.getElementById('totalGeneral').textContent.replace('$', '')
    };

    fetch('guardar_reservacion.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.mensaje);
        if (data.exito) {
            alert("se pudoooo")
            // window.location.href = 'gracias.html';
        }
    })
        .catch(error => console.error('Error:', error));
});