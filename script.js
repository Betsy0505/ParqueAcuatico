document.addEventListener('DOMContentLoaded', function() {
    const inputsCalculables = document.querySelectorAll('.calcular');
    
    // Configurar cálculo de subtotales
    inputsCalculables.forEach(input => {
        input.addEventListener('input', calcularSubtotales);
    });
    
    function calcularSubtotales() {
        let totalGeneral = 0;
        
        inputsCalculables.forEach(input => {
            const precio = parseFloat(input.dataset.precio);
            const cantidad = parseFloat(input.value) || 0;
            const subtotal = precio * cantidad;
            
            const subtotalElement = input.nextElementSibling;
            if(subtotalElement && subtotalElement.classList.contains('subtotal')) {
                subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            }
            
            totalGeneral += subtotal;
        });
        
        document.getElementById('totalGeneral').textContent = `$${totalGeneral.toFixed(2)}`;
    }
    
    document.getElementById('btnComprar').addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Validar que haya al menos un item seleccionado
        const total = parseFloat(document.getElementById('totalGeneral').textContent.replace('$', ''));
        if (total <= 0) {
            alert('Por favor selecciona al menos un item para comprar');
            return;
        }
        
        // Mostrar estado de carga
        const btnComprar = document.getElementById('btnComprar');
        btnComprar.disabled = true;
        btnComprar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> Procesando...';
        
        try {
            // Preparar datos del formulario
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
            formData.append('total', total);
            
            // Enviar datos al servidor
            const response = await fetch('http://parqueacuatico.test/guardar_reservacion.php', {
                method: 'POST',
                body: formData
            });
            
            // Verificar si la respuesta es JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`La respuesta del servidor no es válida: ${text.substring(0, 100)}...`);
            }
            
            const data = await response.json();
            
            if (!data.exito) {
                throw new Error(data.error || 'Error al procesar la compra');
            }
            
            // Limpiar formulario
            inputsCalculables.forEach(input => {
                input.value = '';
                const subtotalElement = input.nextElementSibling;
                if(subtotalElement && subtotalElement.classList.contains('subtotal')) {
                    subtotalElement.textContent = '$0';
                }
            });
            document.getElementById('totalGeneral').textContent = '$0';
            
            alert('¡Reservación exitosa! Serás redirigido al ticket.');
            window.location.href = `ticket.html?id=${data.id}`;
            
        } catch (error) {
            console.error('Error:', error);
            alert(`Error al procesar la compra: ${error.message}`);
        } finally {
            btnComprar.disabled = false;
            btnComprar.textContent = 'Comprar';
        }
    });
    
    calcularSubtotales();
});