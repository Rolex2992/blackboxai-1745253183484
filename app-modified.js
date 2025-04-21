// Main application logic

// DOM Elements
const vehicleModal = document.getElementById('vehicleModal');
const vehicleForm = document.getElementById('vehicleForm');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const vehiclesTableBody = document.getElementById('vehiclesTableBody');

// Status badge styles
function getStatusBadge(status) {
    const styles = {
        activo: 'bg-green-100 text-green-800',
        mantenimiento: 'bg-yellow-100 text-yellow-800',
        fueraDeServicio: 'bg-red-100 text-red-800'
    };

    const labels = {
        activo: 'Activo',
        mantenimiento: 'En Mantenimiento',
        fueraDeServicio: 'Fuera de Servicio'
    };

    return `
        <span class="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}">
            ${labels[status] || status}
        </span>
    `;
}

// Initialize application
function init() {
    try {
        // Load and display company name from localStorage
        const companyName = localStorage.getItem('companyName') || '';
        const companyNameDisplay = document.getElementById('companyNameDisplay');
        companyNameDisplay.textContent = companyName;

        renderVehiclesTable();
        updateVehicleCounters();
        
        // Set up event listeners for filters
        searchInput.addEventListener('input', renderVehiclesTable);
        statusFilter.addEventListener('change', renderVehiclesTable);

        // Set up event listeners for company name modal buttons
        document.getElementById('editCompanyNameBtn').addEventListener('click', () => {
            document.getElementById('companyNameInput').value = companyName;
            document.getElementById('companyNameModal').classList.remove('hidden');
        });
        document.getElementById('cancelCompanyNameBtn').addEventListener('click', () => {
            document.getElementById('companyNameModal').classList.add('hidden');
        });
        document.getElementById('saveCompanyNameBtn').addEventListener('click', () => {
            const input = document.getElementById('companyNameInput');
            const newName = input.value.trim();
            localStorage.setItem('companyName', newName);
            companyNameDisplay.textContent = newName;
            document.getElementById('companyNameModal').classList.add('hidden');
            showToast('Nombre de la empresa actualizado');
        });
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showToast('Error al inicializar la aplicación', 'error');
    }
}

// Render vehicles table
function renderVehiclesTable() {
    try {
        const searchTerm = searchInput.value;
        const statusFilterValue = statusFilter.value;
        // Get all vehicles from vehicles.js
        const allVehicles = getVehicles();
        // Filter vehicles locally here instead of calling filterVehicles which uses vehicles variable
        const filteredVehicles = allVehicles.filter(vehicle => {
            const normalizedSearch = searchTerm.toLowerCase().trim();
            const searchMatches = !normalizedSearch || [
                vehicle.plateNumber,
                vehicle.model,
                vehicle.driver,
                vehicle.year.toString(),
                vehicle.mileage.toString()
            ].some(field => {
                if (!field) return false;
                return field.toString().toLowerCase().includes(normalizedSearch);
            });
            const statusMatches = statusFilterValue === 'todos' || vehicle.status === statusFilterValue;
            return searchMatches && statusMatches;
        });

        if (filteredVehicles.length === 0) {
            vehiclesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                        No se encontraron vehículos
                    </td>
                </tr>
            `;
        } else {
            vehiclesTableBody.innerHTML = filteredVehicles.map(vehicle => `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div>
                                <div class="text-sm font-medium text-gray-900">${vehicle.plateNumber}</div>
                                <div class="text-sm text-gray-500">${vehicle.model} (${vehicle.year})</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${getStatusBadge(vehicle.status)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${formatDate(vehicle.lastMaintenance)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${formatNumber(vehicle.mileage)} km
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${vehicle.driver || '-'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="openEditVehicleModal('${vehicle.id}')" 
                                class="text-blue-600 hover:text-blue-900 mr-2 transition-colors">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="openChecklistModal('${vehicle.id}')"
                                class="text-green-600 hover:text-green-900 mr-2 transition-colors"
                                title="Control Semanal">
                            <i class="fas fa-clipboard-check"></i>
                        </button>
                        <button onclick="confirmDeleteVehicle('${vehicle.id}')"
                                class="text-red-600 hover:text-red-900 transition-colors">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        // Update counters after rendering
        updateVehicleCounters();
        console.log('Rendered vehicles:', filteredVehicles);
    } catch (error) {
        console.error('Error rendering vehicles table:', error);
        showToast('Error al mostrar los vehículos', 'error');
    }
}

// Open modal to add new vehicle
function openAddVehicleModal() {
    document.getElementById('modalTitle').textContent = 'Agregar Vehículo';
    vehicleForm.reset();
    document.getElementById('vehicleId').value = '';
    vehicleModal.classList.remove('hidden');
}

// Open modal to edit vehicle
function openEditVehicleModal(id) {
    const vehicles = getVehicles();
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;

    document.getElementById('modalTitle').textContent = 'Editar Vehículo';
    document.getElementById('vehicleId').value = vehicle.id;
    document.getElementById('plateNumber').value = vehicle.plateNumber;
    document.getElementById('model').value = vehicle.model;
    document.getElementById('year').value = vehicle.year;
    document.getElementById('mileage').value = vehicle.mileage;
    document.getElementById('driver').value = vehicle.driver || '';
    document.getElementById('status').value = vehicle.status;
    document.getElementById('lastMaintenance').value = vehicle.lastMaintenance || '';

    vehicleModal.classList.remove('hidden');
}

// Close modal
function closeModal() {
    vehicleModal.classList.add('hidden');
    vehicleForm.reset();
}

// Handle form submit
function handleVehicleSubmit(e) {
    e.preventDefault();

    try {
        const vehicleData = {
            plateNumber: document.getElementById('plateNumber').value.trim(),
            model: document.getElementById('model').value.trim(),
            year: parseInt(document.getElementById('year').value),
            mileage: parseInt(document.getElementById('mileage').value),
            driver: document.getElementById('driver').value.trim(),
            status: 'activo',
            lastMaintenance: null
        };

        // Validate required fields
        if (!vehicleData.plateNumber || !vehicleData.model || !vehicleData.year || !vehicleData.mileage) {
            showToast('Todos los campos son obligatorios', 'error');
            return;
        }

        // Remove plate number format validation to allow open format
        // const plateRegex = /^[A-Z]{3}\d{3}$/;
        // if (!plateRegex.test(vehicleData.plateNumber)) {
        //     showToast('Formato de placa inválido (ejemplo: ABC123)', 'error');
        //     return;
        // }

        // Validate year
        const currentYear = new Date().getFullYear();
        if (vehicleData.year < 1900 || vehicleData.year > currentYear + 1) {
            showToast('Año inválido', 'error');
            return;
        }

        // Validate mileage
        if (vehicleData.mileage < 0) {
            showToast('Kilometraje inválido', 'error');
            return;
        }

        const vehicleId = document.getElementById('vehicleId').value;
        let result;

        if (vehicleId) {
            result = updateVehicle(vehicleId, vehicleData);
            if (result) {
                showToast('Vehículo actualizado exitosamente');
                console.log('Vehicle updated:', result);
            } else {
                showToast('Error al actualizar el vehículo', 'error');
            }
        } else {
            result = addVehicle(vehicleData);
            if (result) {
                showToast('Vehículo agregado exitosamente');
                console.log('Vehicle added:', result);
            } else {
                showToast('Error al agregar el vehículo', 'error');
            }
        }

        if (result) {
            closeModal();
            renderVehiclesTable();
        }
    } catch (error) {
        console.error('Error handling vehicle submit:', error);
        showToast('Error al procesar el formulario', 'error');
    }
}

// Confirm and delete vehicle
function confirmDeleteVehicle(id) {
    if (confirm('¿Está seguro de que desea eliminar este vehículo?')) {
        if (deleteVehicle(id)) {
            showToast('Vehículo eliminado exitosamente');
            renderVehiclesTable();
        } else {
            showToast('Error al eliminar el vehículo', 'error');
        }
    }
}

// Open checklist modal
function openChecklistModal(vehicleId) {
    const vehicles = getVehicles();
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    document.getElementById('checklistVehicleId').value = vehicleId;
    document.getElementById('checklistModalTitle').textContent = `Control Semanal - ${vehicle.plateNumber}`;
    
    // Reset form
    document.querySelectorAll('#checklistForm input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('observaciones').value = '';
    
    // Show latest checklist if exists
    const latestChecklist = vehicle.checklists[vehicle.checklists.length - 1];
    if (latestChecklist) {
        latestChecklist.items.forEach(item => {
            const checkbox = document.getElementById(item.id);
            if (checkbox) checkbox.checked = item.checked;
        });
        document.getElementById('observaciones').value = latestChecklist.observaciones || '';
    }

    document.getElementById('checklistModal').classList.remove('hidden');
}

// Handle checklist form submit
function handleChecklistSubmit(e) {
    e.preventDefault();
    
    const vehicleId = document.getElementById('checklistVehicleId').value;
    const mileageUpdateInput = document.getElementById('mileageUpdate').value;
    const maintenanceDateInput = document.getElementById('maintenanceDate').value;
    const maintenanceDescriptionInput = document.getElementById('maintenanceDescription').value;

    const checklistData = {
        aceite: document.getElementById('aceite').checked,
        frenos: document.getElementById('frenos').checked,
        neumaticos: document.getElementById('neumaticos').checked,
        luces: document.getElementById('luces').checked,
        bateria: document.getElementById('bateria').checked,
        limpieza: document.getElementById('limpieza').checked,
        documentos: document.getElementById('documentos').checked,
        observaciones: document.getElementById('observaciones').value,
        createdBy: 'Usuario' // Esto podría venir de un sistema de autenticación
    };

    // Update vehicle mileage if provided and valid
    if (mileageUpdateInput) {
        const mileageUpdate = parseInt(mileageUpdateInput);
        if (!isNaN(mileageUpdate) && mileageUpdate >= 0) {
            const vehicles = getVehicles();
            const vehicle = vehicles.find(v => v.id === vehicleId);
            if (vehicle && mileageUpdate > vehicle.mileage) {
                vehicle.mileage = mileageUpdate;
                updateVehicle(vehicleId, { mileage: mileageUpdate });
            }
        } else {
            showToast('Kilometraje actualizado inválido', 'error');
            return;
        }
    }

    // Schedule maintenance if date provided
    if (maintenanceDateInput) {
        const maintenanceDate = new Date(maintenanceDateInput);
        if (!isNaN(maintenanceDate.getTime())) {
            updateVehicle(vehicleId, { lastMaintenance: maintenanceDateInput });
            // Optionally, store maintenanceDescription somewhere if needed
            // For now, we can add it as an observation in checklistData
            if (maintenanceDescriptionInput) {
                checklistData.observaciones += `\nMantenimiento programado: ${maintenanceDescriptionInput}`;
            }
        } else {
            showToast('Fecha de mantenimiento inválida', 'error');
            return;
        }
    }

    if (addChecklist(vehicleId, checklistData)) {
        showToast('Control semanal registrado exitosamente');
        document.getElementById('checklistModal').classList.add('hidden');
        renderVehiclesTable();
    } else {
        showToast('Error al registrar el control semanal', 'error');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    // Add event listeners after DOM is loaded
    document.getElementById('checklistForm').addEventListener('submit', handleChecklistSubmit);
    document.getElementById('vehicleForm').addEventListener('submit', handleVehicleSubmit);
});
