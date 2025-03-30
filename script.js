document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.calcular');
    
    inputs.forEach(input => {
        input.addEventListener('input', calcularSubtotal);
    });
    
    function calcularSubtotal() {
        let totalGeneral = 0;
        
        inputs.forEach(input => {
            const precio = parseFloat(input.dataset.precio);
            const cantidad = parseFloat(input.value) || 0;
            const subtotal = precio * cantidad;
            
            const subtotalElement = input.nextElementSibling;
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            
            totalGeneral += subtotal;
        });
        
        document.getElementById('totalGeneral').textContent = `$${totalGeneral.toFixed(2)}`;
    }
});