// Vehicle data management

// Initialize vehicles from localStorage or empty array
let vehicles = [];
try {
    const storedVehicles = localStorage.getItem('vehicles');
    vehicles = storedVehicles ? JSON.parse(storedVehicles) : [];
} catch (error) {
    console.error('Error loading vehicles from localStorage:', error);
    vehicles = [];
}

// Save vehicles to localStorage
function saveVehicles() {
    try {
        // Validate vehicles array
        if (!Array.isArray(vehicles)) {
            console.error('Vehicles is not an array');
            return false;
        }

        // Clean and validate each vehicle object
        const cleanVehicles = vehicles.map(vehicle => ({
            id: vehicle.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            plateNumber: (vehicle.plateNumber || '').toUpperCase(),
            model: vehicle.model || '',
            year: parseInt(vehicle.year) || new Date().getFullYear(),
            mileage: parseInt(vehicle.mileage) || 0,
            driver: vehicle.driver || '',
            status: vehicle.status || 'activo',
            lastMaintenance: vehicle.lastMaintenance || null,
            checklists: Array.isArray(vehicle.checklists) ? vehicle.checklists : [],
            createdAt: vehicle.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }));

        // Save to localStorage
        const data = JSON.stringify(cleanVehicles);
        localStorage.setItem('vehicles', data);
        
        // Update vehicles array with cleaned data
        vehicles = cleanVehicles;
        
        // Update counters and log
        updateVehicleCounters();
        console.log('Vehicles saved successfully:', cleanVehicles);
        return true;
    } catch (error) {
        console.error('Error saving vehicles to localStorage:', error);
        return false;
    }
}

// Initialize vehicles from localStorage
function initializeVehicles() {
    try {
        const data = localStorage.getItem('vehicles');
        if (data) {
            vehicles = JSON.parse(data);
            console.log('Loaded vehicles:', vehicles);
        }
        updateVehicleCounters();
    } catch (error) {
        console.error('Error loading vehicles from localStorage:', error);
        vehicles = [];
    }
}

// Initialize vehicles when the script loads
initializeVehicles();

// Get all vehicles
function getVehicles() {
    return vehicles;
}

// Add new vehicle
function addVehicle(vehicleData) {
    try {
        // Generate unique ID using timestamp and random number
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create new vehicle object with complete data structure
        const newVehicle = {
            id: uniqueId,
            plateNumber: vehicleData.plateNumber.toUpperCase(),
            model: vehicleData.model,
            year: vehicleData.year,
            mileage: vehicleData.mileage,
            driver: vehicleData.driver,
            status: 'activo',
            lastMaintenance: null,
            checklists: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add to vehicles array
        vehicles.push(newVehicle);
        
        // Save to localStorage and update counters
        const saved = saveVehicles();
        
        if (saved) {
            console.log('Vehicle added successfully:', newVehicle);
            return newVehicle;
        } else {
            console.error('Failed to save vehicle to localStorage');
            return null;
        }
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return null;
    }
}

// Update vehicle
function updateVehicle(id, vehicleData) {
    try {
        const index = vehicles.findIndex(v => v.id === id);
        if (index === -1) return false;
        
        vehicles[index] = {
            ...vehicles[index],
            ...vehicleData,
            updatedAt: new Date().toISOString()
        };
        
        return saveVehicles() ? vehicles[index] : false;
    } catch (error) {
        console.error('Error updating vehicle:', error);
        return false;
    }
}

// Delete vehicle
function deleteVehicle(id) {
    try {
        const index = vehicles.findIndex(v => v.id === id);
        if (index === -1) return false;
        
        vehicles.splice(index, 1);
        return saveVehicles();
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        return false;
    }
}

// Filter vehicles
function filterVehicles(searchTerm, statusFilter) {
    try {
        const normalizedSearch = searchTerm.toLowerCase().trim();
        
        return vehicles.filter(vehicle => {
            // Search in multiple fields
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

            // Status filter
            const statusMatches = statusFilter === 'todos' || vehicle.status === statusFilter;

            return searchMatches && statusMatches;
        });
    } catch (error) {
        console.error('Error filtering vehicles:', error);
        return [];
    }
}

// Add checklist to vehicle
function addChecklist(vehicleId, checklistData) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return false;

    const newChecklist = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: [
            { id: 'aceite', label: 'Nivel de Aceite', checked: checklistData.aceite || false },
            { id: 'frenos', label: 'Estado de Frenos', checked: checklistData.frenos || false },
            { id: 'neumaticos', label: 'Estado de Neumáticos', checked: checklistData.neumaticos || false },
            { id: 'luces', label: 'Funcionamiento de Luces', checked: checklistData.luces || false },
            { id: 'bateria', label: 'Estado de Batería', checked: checklistData.bateria || false },
            { id: 'limpieza', label: 'Limpieza General', checked: checklistData.limpieza || false },
            { id: 'documentos', label: 'Documentación al Día', checked: checklistData.documentos || false }
        ],
        observaciones: checklistData.observaciones || '',
        createdBy: checklistData.createdBy || 'Sistema'
    };

    vehicle.checklists.push(newChecklist);
    saveVehicles();
    return newChecklist;
}

// Get vehicle checklists
function getVehicleChecklists(vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.checklists : [];
}

// Update vehicle counters
function updateVehicleCounters() {
    try {
        const counts = {
            activo: 0,
            mantenimiento: 0,
            fueraDeServicio: 0
        };

        vehicles.forEach(vehicle => {
            if (vehicle.status in counts) {
                counts[vehicle.status]++;
            }
        });

        document.getElementById('activeCount').textContent = counts.activo;
        document.getElementById('maintenanceCount').textContent = counts.mantenimiento;
        document.getElementById('outOfServiceCount').textContent = counts.fueraDeServicio;
        document.getElementById('totalCount').textContent = vehicles.length;

        console.log('Updated counters:', counts);
    } catch (error) {
        console.error('Error updating counters:', error);
    }
}
