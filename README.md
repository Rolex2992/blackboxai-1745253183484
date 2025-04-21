
Built by https://www.blackbox.ai

---

```markdown
# Sistema de Gestión de Vehículos

## Project Overview
El **Sistema de Gestión de Vehículos** es una aplicación web diseñada para gestionar información sobre vehículos de una empresa. Permite a los usuarios agregar, editar y eliminar vehículos, así como realizar un seguimiento de su estado y mantenimiento. La aplicación utiliza almacenamiento local para guardar los datos y presenta una interfaz de usuario amigable y responsiva utilizando Tailwind CSS.

## Installation
Para instalar y ejecutar el proyecto en su máquina local, siga los siguientes pasos:

1. **Clone el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd sistema-gestion-vehiculos
   ```

2. **Abre `index.html` en tu navegador:**
   Simplemente arrastra el archivo `index.html` a tu navegador web o inicia un servidor local para acceder a la aplicación.

## Usage
Una vez que la aplicación esté abierta en el navegador:

- **Agregar un vehículo:** 
  Haga clic en "Agregar Vehículo" para abrir un modal y completar los detalles del vehículo.
  
- **Editar un vehículo:**
  Haga clic en el ícono de edición junto al vehículo en la tabla para modificar su información.

- **Eliminar un vehículo:**
  Haga clic en el ícono de papelera para eliminar un vehículo.

- **Filtrar vehículos:**
  Utilice el campo de búsqueda y el filtro de estado para encontrar vehículos específicos.

- **Realizar un control semanal:**
  Haga clic en el ícono de lista de verificación para registrar un control semanal del vehículo.

## Features
- Interfaz de usuario responsiva y amigable.
- Funcionalidad de agregar, editar y eliminar vehículos.
- Filtros por estado (Activo, En Mantenimiento, Fuera de Servicio).
- Almacenamiento local para la persistencia de datos.
- Registro de controles semanales con verificación de múltiples ítems.
- Visualización de estadísticas sobre los vehículos gestionados.

## Dependencies
La aplicación utiliza las siguientes dependencias:

- [Tailwind CSS](https://tailwindcss.com/) para estilo y diseño.
- [Font Awesome](https://fontawesome.com/) para íconos.

*Nota: Las dependencias están incluidas en el archivo `index.html`.*

## Project Structure
La estructura de archivos del proyecto es la siguiente:

```
/
├── index.html          # Página principal de la aplicación
├── app-modified.js     # Lógica de la aplicación
├── utils.js            # Funciones utilitarias
├── vehicles.js         # Manejo de datos de vehículos
└── README.md           # Documentación del proyecto
```

### Descripción de archivos:
- **index.html:** Contiene la estructura básica de la interfaz de usuario y enlaces a los estilos y scripts.
- **app-modified.js:** Contiene la lógica que interactúa con el DOM y gestiona eventos de usuario.
- **utils.js:** Proporciona funciones de utilidad como notificaciones y formato de datos.
- **vehicles.js:** Maneja la lógica relacionada con los vehículos, incluyendo adición, eliminación y almacenamiento.

---

¡Disfruta gestionando tus vehículos con esta herramienta!
```