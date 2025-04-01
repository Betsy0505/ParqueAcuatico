document.addEventListener('DOMContentLoaded', function() {
    const { jsPDF } = window.jspdf;
    const urlParams = new URLSearchParams(window.location.search);
    const reservaId = urlParams.get('id');
    
    if (!reservaId) {
        mostrarError('No se encontró el ID de reserva');
        return;
    }
    
    // Obtener datos de la reserva
    fetch(`obtener_reservacion.php?id=${reservaId}`)
        .then(response => response.json())
        .then(data => {
            if (data.exito) {
                mostrarTicket(data.reserva);
                configurarBotonPDF(data.reserva);
            } else {
                throw new Error(data.mensaje || 'Error al cargar la reserva');
            }
        })
        .catch(error => {
            mostrarError(error.message);
            console.error('Error:', error);
        });
    
    function mostrarTicket(reserva) {
        const ticketInfo = document.getElementById('ticketInfo');
        
        // Formatear fecha
        const fecha = new Date(reserva.fecha_registro);
        const fechaFormateada = fecha.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Crear HTML del ticket
        ticketInfo.innerHTML = `
            <div class="mb-4">
                <div class="ticket-item d-flex justify-content-between">
                    <span><strong>Número de Ticket:</strong></span>
                    <span>${reserva.id}</span>
                </div>
                <div class="ticket-item d-flex justify-content-between">
                    <span><strong>Fecha:</strong></span>
                    <span>${fechaFormateada}</span>
                </div>
            </div>
            
            <h5 class="mt-4 mb-3">Detalles de la Reserva</h5>
            
            ${generarItemsHTML(reserva)}
            
            <div class="mt-4 pt-3 border-top">
                <div class="ticket-item d-flex justify-content-between fw-bold fs-5">
                    <span>TOTAL:</span>
                    <span>$${parseFloat(reserva.total).toFixed(2)}</span>
                </div>
            </div>
            
            <div class="mt-4 pt-3 border-top text-center text-muted small">
                <p>Presentar este ticket al ingresar al parque</p>
                <p class="mb-0">¡Gracias por su preferencia!</p>
            </div>
        `;
    }
    
    function generarItemsHTML(reserva) {
        let html = '';
        
        // Boletos
        if (reserva.adultos > 0) {
            html += `
                <div class="ticket-item d-flex justify-content-between">
                    <span>Adultos (x${reserva.adultos})</span>
                    <span>$${(reserva.adultos * 100).toFixed(2)}</span>
                </div>
            `;
        }
        
        if (reserva.ninos > 0) {
            html += `
                <div class="ticket-item d-flex justify-content-between">
                    <span>Niños (x${reserva.ninos})</span>
                    <span>$${(reserva.ninos * 70).toFixed(2)}</span>
                </div>
            `;
        }
        
        // Mobiliario
        if (reserva.sillas > 0) html += agregarItem('Sillas', reserva.sillas, 30);
        if (reserva.mesas > 0) html += agregarItem('Mesas', reserva.mesas, 50);
        if (reserva.sombrillas > 0) html += agregarItem('Sombrillas', reserva.sombrillas, 80);
        
        // Espacios
        if (reserva.espacio_campamento > 0) html += agregarItem('Espacio Campamento', reserva.espacio_campamento, 100);
        if (reserva.renta_campamento_4 > 0) html += agregarItem('Campamento 4p', reserva.renta_campamento_4, 200);
        if (reserva.renta_campamento_8 > 0) html += agregarItem('Campamento 8p', reserva.renta_campamento_8, 300);
        if (reserva.renta_campamento_12 > 0) html += agregarItem('Campamento 12p', reserva.renta_campamento_12, 400);
        if (reserva.cabana_4 > 0) html += agregarItem('Cabaña 4p', reserva.cabana_4, 500);
        if (reserva.cabana_6 > 0) html += agregarItem('Cabaña 6p', reserva.cabana_6, 700);
        
        return html;
    }
    
    function agregarItem(nombre, cantidad, precioUnitario) {
        return `
            <div class="ticket-item d-flex justify-content-between">
                <span>${nombre} (x${cantidad})</span>
                <span>$${(cantidad * precioUnitario).toFixed(2)}</span>
            </div>
        `;
    }
    
    function configurarBotonPDF(reserva) {
        document.getElementById('btnExportPDF').addEventListener('click', () => {
            generarPDF(reserva);
        });
    }
    
    function generarPDF(reserva) {
        const doc = new jsPDF();
        
        // Encabezado
        doc.setFontSize(18);
        doc.setTextColor(40, 177, 177);
        doc.text('PARQUE ACUÁTICO FELIZ', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Ticket #${reserva.id}`, 105, 30, { align: 'center' });
        
        // Fecha
        const fecha = new Date(reserva.fecha_registro);
        doc.text(`Fecha: ${fecha.toLocaleDateString('es-MX')} ${fecha.toLocaleTimeString('es-MX')}`, 105, 35, { align: 'center' });
        
        // Línea divisoria
        doc.setDrawColor(40, 177, 177);
        doc.line(20, 40, 190, 40);
        
        // Detalles
        doc.setFontSize(14);
        doc.text('DETALLES DE LA RESERVA', 20, 50);
        
        // Items
        let y = 60;
        doc.setFontSize(12);
        
        // Boletos
        if (reserva.adultos > 0) y = agregarItemPDF(doc, 'Adultos', reserva.adultos, 100, y);
        if (reserva.ninos > 0) y = agregarItemPDF(doc, 'Niños', reserva.ninos, 70, y);
        
        // Mobiliario
        if (reserva.sillas > 0) y = agregarItemPDF(doc, 'Sillas', reserva.sillas, 30, y);
        if (reserva.mesas > 0) y = agregarItemPDF(doc, 'Mesas', reserva.mesas, 50, y);
        if (reserva.sombrillas > 0) y = agregarItemPDF(doc, 'Sombrillas', reserva.sombrillas, 80, y);
        
        // Espacios
        if (reserva.espacio_campamento > 0) y = agregarItemPDF(doc, 'Espacio Campamento', reserva.espacio_campamento, 100, y);
        if (reserva.renta_campamento_4 > 0) y = agregarItemPDF(doc, 'Campamento 4p', reserva.renta_campamento_4, 200, y);
        if (reserva.renta_campamento_8 > 0) y = agregarItemPDF(doc, 'Campamento 8p', reserva.renta_campamento_8, 300, y);
        if (reserva.renta_campamento_12 > 0) y = agregarItemPDF(doc, 'Campamento 12p', reserva.renta_campamento_12, 400, y);
        if (reserva.cabana_4 > 0) y = agregarItemPDF(doc, 'Cabaña 4p', reserva.cabana_4, 500, y);
        if (reserva.cabana_6 > 0) y = agregarItemPDF(doc, 'Cabaña 6p', reserva.cabana_6, 700, y);
        
        // Total
        doc.setFontSize(14);
        doc.text(`TOTAL: $${parseFloat(reserva.total).toFixed(2)}`, 20, y + 10);
        
        // Pie de página
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Presentar este ticket al ingresar al parque', 105, 280, { align: 'center' });
        doc.text('¡Gracias por su preferencia!', 105, 285, { align: 'center' });
        
        // Guardar PDF
        doc.save(`ticket_${reserva.id}.pdf`);
    }
    
    function agregarItemPDF(doc, nombre, cantidad, precio, y) {
        doc.text(`${nombre} (x${cantidad}):`, 20, y);
        doc.text(`$${(cantidad * precio).toFixed(2)}`, 180, y, { align: 'right' });
        return y + 7;
    }
    
    function mostrarError(mensaje) {
        document.getElementById('ticketInfo').innerHTML = `
            <div class="alert alert-danger">
                <h5 class="alert-heading">Error</h5>
                <p>${mensaje}</p>
                <hr>
                <a href="index.html" class="btn btn-outline-danger">Volver al inicio</a>
            </div>
        `;
        document.getElementById('btnExportPDF').style.display = 'none';
    }
});