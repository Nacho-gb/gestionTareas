# Gestión de Tareas con React y Vite

Este es un proyecto de **gestión de tareas** en el que los usuarios pueden crear una cuenta, gestionar sus tareas y realizar acciones sobre ellas (completar, editar y eliminar).

## Tecnologías utilizadas

- **React**: Librería para la creación de interfaces de usuario.
- **Vite**: Herramienta de construcción y bundling rápida y optimizada para proyectos de frontend.
- **Tailwind CSS**: Framework de CSS que permite un diseño rápido y personalizable mediante clases utilitarias.
- **React Router**: Librería para la gestión de rutas en aplicaciones de una sola página (SPA).
- **LocalStorage**: Utilizado para almacenar la información de los usuarios y sus tareas de forma local en el navegador.

## Descripción

El proyecto permite a los usuarios gestionar sus tareas de manera sencilla, con las siguientes funcionalidades:

- **Registro de usuarios**: Los usuarios pueden registrarse y acceder a la aplicación.
- **Gestión de tareas**: Los usuarios pueden crear nuevas tareas, editarlas, marcarlas como completadas o eliminarlas.
- **Filtrado de tareas**: Las tareas se muestran separadas en **pendientes** y **completadas**.
- **Persistencia de datos**: Toda la información de los usuarios y sus tareas se almacena en el **LocalStorage** para que se mantenga disponible incluso si se recarga la página o se cierra el navegador.

## Instalación

Sigue estos pasos para clonar e instalar el proyecto:

1. Clona este repositorio:

   git clone https://github.com/Nacho-gb/gestionTareas.git

2. Navega al directorio del proyecto

   cd gestionTareas

3. Instala las dependencias del proyecto:

   npm install

4. Inicia el servidor de desarrollo:

   npm run dev
