document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('obtener_reservaciones.php');
        const data = await response.json();

        if (data.exito) {
            // 1. Procesar Boletos vendidos (tabla superior)
            const boletos = data.reservaciones.filter(reserva => 
                reserva.adultos > 0 || reserva.ninos > 0
            );
            
            // 2. Procesar Items adicionales (tabla inferior)
            const itemsAdicionales = procesarItemsAdicionales(data.reservaciones);
            
            // Renderizar Boletos
            const tbodyBoletos = document.querySelector('#tablaReservaciones tbody');
            tbodyBoletos.innerHTML = boletos.length > 0 ? 
                boletos.map(reserva => `
                    <tr>
                        <td>${reserva.id}</td>
                        <td>${reserva.adultos}</td>
                        <td>${reserva.ninos}</td>
                        <td>$${Number(reserva.total).toFixed(2)}</td>
                        <td>${new Date(reserva.fecha_registro).toLocaleString()}</td>
                    </tr>
                `).join('') : 
                `<tr><td colspan="5" class="text-center text-muted">No hay boletos vendidos</td></tr>`;
            
            // Renderizar Items Adicionales
            const tbodyItems = document.getElementById('tablaItemsAdicionales');
            tbodyItems.innerHTML = itemsAdicionales.length > 0 ? 
                itemsAdicionales.map(item => `
                    <tr>
                        <td>${item.idReserva}</td>
                        <td>${item.nombre}</td>
                        <td>${item.cantidad}</td>
                        <td>$${item.total.toFixed(2)}</td>
                        <td>${new Date(item.fecha).toLocaleString()}</td>
                    </tr>
                `).join('') : 
                `<tr><td colspan="5" class="text-center text-muted">No hay reservaciones recientes</td></tr>`;
                
        } else {
            mostrarError('Error al cargar reservaciones');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión');
    }
});

function procesarItemsAdicionales(reservaciones) {
    const items = [];
    
    // Definición de todos los items posibles con sus precios
    const configItems = {
        mobiliario: [
            { campo: 'sillas', nombre: 'Silla', precio: 30 },
            { campo: 'mesas', nombre: 'Mesa', precio: 50 },
            { campo: 'sombrillas', nombre: 'Sombrilla', precio: 80 }
        ],
        espacios: [
            { campo: 'espacio_campamento', nombre: 'Espacio Campamento', precio: 100 },
            { campo: 'renta_campamento_4', nombre: 'Campamento 4p', precio: 200 },
            { campo: 'renta_campamento_8', nombre: 'Campamento 8p', precio: 300 },
            { campo: 'renta_campamento_12', nombre: 'Campamento 12p', precio: 400 },
            { campo: 'cabana_4', nombre: 'Cabaña 4p', precio: 500 },
            { campo: 'cabana_6', nombre: 'Cabaña 6p', precio: 700 }
        ]
    };

    reservaciones.forEach(reserva => {
        // Procesar mobiliario
        configItems.mobiliario.forEach(item => {
            if (reserva[item.campo] > 0) {
                items.push({
                    idReserva: reserva.id,
                    nombre: item.nombre,
                    cantidad: reserva[item.campo],
                    total: reserva[item.campo] * item.precio,
                    fecha: reserva.fecha_registro
                });
            }
        });
        
        // Procesar espacios
        configItems.espacios.forEach(item => {
            if (reserva[item.campo] > 0) {
                items.push({
                    idReserva: reserva.id,
                    nombre: item.nombre,
                    cantidad: reserva[item.campo],
                    total: reserva[item.campo] * item.precio,
                    fecha: reserva.fecha_registro
                });
            }
        });
    });
    
    return items;
}

function mostrarError(mensaje) {
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-danger alert-dismissible fade show';
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.px-md-4').prepend(alerta);
}