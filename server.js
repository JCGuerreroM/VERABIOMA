import express from "express";
import mysql from "mysql";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
//Aqui se va hacer la configuracion para la conecion con MYSQL
const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'root',
    database: ''
});
//revisamos si se conecto
connection.connect((err) => {
    if(err){
        console.error('error al conectar con MYSQL:', err);
        return;
    } console.log('fue conectado correctamente!!!');
});

const pool = mysql.createPool(process.env.DATABASE_URL);

// REGISTRO DE USUARIO
app.post('/api/registro', async (req, res) => {
  const { Nombre, Apellido, Correo, Direccion, Telefono, Password } = req.body;

  if (!Nombre || !Apellido || !Correo || !Direccion || !Telefono || !Password) {
    return res.status(400).send("Todos los campos son obligatorios.");
  }

  try {
    const [resultado] = await pool.query(
      'INSERT INTO usuario (nombre, apellido, correo, contrasena, direccion, codigo_postal, notas_direccion, telefono) VALUES (?, ?, ?, ?, ?, ?)',
      [Nombre, Apellido, Correo, Password, Direccion, Telefono]
    );
    res.status(201).json({ 
      mensaje: "Guardado en BD", 
      usuario_id: resultado.insertId 
    });
    }catch (error) {
    console.error("Error en BD:", error);
    res.status(500).send("Error del servidor al registrar");
  }
});

// LOGIN DE USUARIO
app.post('/api/login', async (req, res) => {
  const { Correo, Password } = req.body;

  if (!Correo || !Password) {
    return res.status(400).json({ mensaje: "Faltan campos por llenar" });
  }

  try {
    const [filas] = await pool.query(
      'SELECT * FROM usuario WHERE correo = ? AND contrasena = ?',
      [Correo, Password]
    );
    if (filas.length === 0) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }
    const usuario = filas[0];
    // AQUÍ SE INSERTA EN LA TABLA HISTORIAL
    await pool.query(
      'INSERT INTO historial_sesiones (id_usuario) VALUES (?)',
      [usuario.id_usuario] 
    );
    res.status(200).json({ 
      mensaje: "Acceso correcto", 
      usuario: usuario 
    });
    }catch (error) {
    console.error("Error en BD:", error);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
});

// CAMBIAR CONTRASEÑA 
app.post('/api/cambiar-password', async (req, res) => {
  const { Correo, NuevaPassword } = req.body;

  if (!Correo || !NuevaPassword) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  try {
    // 1. Verificamos que el usuario exista
    const [filas] = await pool.query(
      'SELECT id_usuario, nombre, apellido FROM usuario WHERE correo = ?',
      [Correo]
    );
    if (filas.length === 0) {
      return res.status(404).json({ mensaje: "El correo no está registrado" });
    }

    const usuario = filas[0];
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;

    // 2. Actualizamos la contraseña en la tabla usuario
    await pool.query(
      'UPDATE usuario SET contrasena = ? WHERE id_usuario = ?',
      [NuevaPassword, usuario.id_usuario]
    );
    // 3. Registramos el evento en el historial de cambios
    await pool.query(
      'INSERT INTO historial_cambio_password (id_usuario, nombre_usuario) VALUES (?, ?)',
      [usuario.id_usuario, nombreCompleto]
    );
    res.status(200).json({ 
      mensaje: "Contraseña actualizada correctamente",
      detalles: {
        usuario: nombreCompleto,
        fecha: new Date().toLocaleString()
      }
    });

  } catch (error) {
    console.error("Error al actualizar contraseña:", error);
    res.status(500).json({ mensaje: "Error en el servidor al actualizar la contraseña" });
  }
});

app.listen(PORT, () => {
    console.log(`El servidor fue activado correrctamente en el http://localhost:${3000}`);
});