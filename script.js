document.addEventListener('DOMContentLoaded', function() {
    // 1. Configurar los cálculos automáticos
    const inputsCalculables = document.querySelectorAll('.calcular');
    
    inputsCalculables.forEach(input => {
        input.addEventListener('input', calcularSubtotales);
    });
    
    // 2. Función para calcular subtotales y total general
    function calcularSubtotales() {
        let totalGeneral = 0;
        
        inputsCalculables.forEach(input => {
            const precio = parseFloat(input.dataset.precio);
            const cantidad = parseFloat(input.value) || 0;
            const subtotal = precio * cantidad;
            
            // Mostrar el subtotal
            const subtotalElement = input.nextElementSibling;
            if(subtotalElement && subtotalElement.classList.contains('subtotal')) {
                subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            }
            
            // Sumar al total general
            totalGeneral += subtotal;
        });
        
        // Actualizar el total general
        document.getElementById('totalGeneral').textContent = `$${totalGeneral.toFixed(2)}`;
    }
    
    // 3. Configurar el envío del formulario - VERSIÓN CORREGIDA
    document.getElementById('btnComprar').addEventListener('click', function(e) {
        e.preventDefault();
        
        calcularSubtotales();
        
        // Crear FormData en lugar de objeto JSON
        const formData = new FormData();
        formData.append('adultos', document.getElementById('adulto').value || 0);
        formData.append('ninos', document.getElementById('niño').value || 0);
        formData.append('sillas', document.getElementById('silla').value || 0);
        formData.append('mesas', document.getElementById('mesa').value || 0);
        formData.append('sombrillas', document.getElementById('sombrilla').value || 0);
        formData.append('espacio_campamento', document.getElementById('espacio1').value || 0);
        formData.append('renta_campamento_4', document.getElementById('espacio2').value || 0);
        formData.append('renta_campamento_8', document.getElementById('espacio3').value || 0);
        formData.append('renta_campamento_12', document.getElementById('espacio4').value || 0);
        formData.append('cabana_4', document.getElementById('espacio5').value || 0);
        formData.append('cabana_6', document.getElementById('espacio6').value || 0);
        formData.append('total', document.getElementById('totalGeneral').textContent.replace('$', ''));
        
        // Enviar como FormData tradicional
        fetch('/parqueAcuatico/guardar_reservacion.php', {
            method: 'POST',
            body: formData // Sin headers de Content-Type
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en el servidor: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if(data.exito) {
                alert("Compra realizada correctamente");
                // Limpiar formulario
                inputsCalculables.forEach(input => {
                    input.value = '';
                    const subtotalElement = input.nextElementSibling;
                    if(subtotalElement && subtotalElement.classList.contains('subtotal')) {
                        subtotalElement.textContent = '$0';
                    }
                });
                document.getElementById('totalGeneral').textContent = '$0';
            } else {
                alert("Error: " + data.mensaje);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error al procesar la compra: " + error.message);
        });
    });
    
    calcularSubtotales();
});