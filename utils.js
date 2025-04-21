// Utility functions for the application

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toast.firstElementChild.className = `${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg`;
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Format date to local string
function formatDate(date) {
    if (!date) return '-';
    try {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(date).toLocaleDateString('es-ES', options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return '-';
    }
}

// Format number with thousands separator
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get status badge HTML
function getStatusBadge(status) {
    const statusConfig = {
        'activo': {
            class: 'bg-green-100 text-green-800',
            label: 'Activo',
            icon: 'fa-check'
        },
        'mantenimiento': {
            class: 'bg-yellow-100 text-yellow-800',
            label: 'En Mantenimiento',
            icon: 'fa-wrench'
        },
        'fueraDeServicio': {
            class: 'bg-red-100 text-red-800',
            label: 'Fuera de Servicio',
            icon: 'fa-times'
        }
    };

    const config = statusConfig[status] || {
        class: 'bg-gray-100 text-gray-800',
        label: 'Desconocido',
        icon: 'fa-question'
    };

    return `<span class="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${config.class}">
                <i class="fas ${config.icon} mr-1"></i>
                ${config.label}
            </span>`;
}

// Validate form data
function validateVehicleData(data) {
    const errors = [];
    
    if (!data.plateNumber.trim()) errors.push("La placa es requerida");
    if (!data.model.trim()) errors.push("El modelo es requerido");
    if (!data.year || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
        errors.push("El año no es válido");
    }
    if (!data.mileage || data.mileage < 0) errors.push("El kilometraje no es válido");
    if (!data.status) errors.push("El estado es requerido");

    return errors;
}
