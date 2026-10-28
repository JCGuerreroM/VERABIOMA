# Verabioma

Aplicación web de Verabioma con una página principal de productos, pantallas separadas de inicio de sesión, registro y recuperación de contraseña, y un servidor Node.js con Express.

## Estructura del proyecto

```text
Verabioma/
├── img/
├── HTML/
├── README.md
├── index.html
├── login.html
├── package-lock.json
├── package.json
├── register.html
├── rvcPassword.html
├── script-PP.js
└── server.js
```

## Archivos y carpetas

- **`img/`**: imágenes y recursos visuales del proyecto.
- **`HTML/`**: se encontrara todo la pagina del proyecto.
- **`index.html`**: landing page con presentación de Verabioma y sus tres productos principales.
- **`login.html`**: formulario independiente para iniciar sesión.
- **`register.html`**: formulario para crear una cuenta.
- **`rvcPassword.html`**: formulario para actualizar la contraseña.
- **`script-PP.js`**: funciones JavaScript para la interacción de la interfaz y las solicitudes al servidor.
- **`server.js`**: servidor Express con rutas para registro, inicio de sesión y cambio de contraseña.
- **`package.json`**: información del proyecto, dependencias y comandos.
- **`package-lock.json`**: archivo de bloqueo de versiones de las dependencias.

## Tecnologías

- HTML
- Tailwind CSS mediante CDN
- JavaScript
- Node.js
- Express
- PostgreSQL
- `cors` y `dotenv`

## Requisitos

Instala Node.js y npm. También necesitas tener PostgreSQL configurado con la base de datos y las tablas que utiliza el backend.

## Instalación

1. Abre una terminal en la carpeta del proyecto.
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto con la variable `DATABASE_URL` correspondiente a tu base de datos. Ejemplo local:

   ```env
   DATABASE_URL=mysql://USUARIO:CONTRASENA@localhost:3306/verabioma
   ```

   Reemplaza `USUARIO` y `CONTRASENA` por las credenciales de tu entorno. No publiques credenciales reales en GitHub.

4. Inicia el servidor:

   ```bash
   npm start
   ```

   Por defecto, el servidor escucha en el puerto `3000`.

## Abrir el frontend

Abre `index.html` con un servidor local o utiliza una extensión como Live Server en Visual Studio Code. Para que los formularios que consultan la API funcionen, `server.js` debe estar ejecutándose y la base de datos debe estar disponible.

Tailwind se carga desde CDN, así que hace falta conexión a internet para cargar sus estilos.

## Rutas del backend

- `POST /api/registro`: registra un usuario.
- `POST /api/login`: valida las credenciales de inicio de sesión.
- `POST /api/cambiar-password`: actualiza la contraseña asociada al correo.

## Notas importantes

- La recuperación de contraseña incluida es una demostración: el formulario envía directamente el correo y la nueva contraseña al servidor. En una aplicación real, debe comprobarse la identidad del usuario con un enlace o código seguro enviado a su correo.
- Antes de usar la aplicación en producción, almacena contraseñas mediante un algoritmo de hash seguro, no en texto plano.
- El archivo `.env` no debe subirse al repositorio.
- La carpeta `HTML` es un avance echo para la pagina principal, pero aun NO esta completa le falta el Tailwind, +HTML, funciones de JavaScript, y tambien para el servior.
