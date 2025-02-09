// models/Usuario.js
const { DataTypes } = require('sequelize'); // Es un objeto de Sequelize que define los tipos de datos para los atributos del modelo.
const bcrypt = require('bcrypt'); // Se usa para hashear las contraseñas antes de almacenarlas en la base de datos.
//const sequelize = require('../db'); // Importa la configuración de la base de datos
const { sequelize } = require('../db_sequelize');



// Define el modelo de Usuario
// Aquí defines un modelo llamado Usuario, que representará una tabla en la base de datos.
// Crea una tabla llamada Usuarios en la base de datos. Sequelize, por defecto, pluraliza el nombre del modelo.
const Usuario = sequelize.define('Usuario', { 
    username: {
        type: DataTypes.STRING, // Tiene que ser de tipo STRING
        allowNull: false, // No puede ser NULL, es obligatorio
        unique: true, // No puede haber dos usuarios con el mismo nombre.
    },
    pass: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users_login', // Con esto Sequelize usará exactamente este nombre en la base de datos en lugar de intentar modificarlo.
    timestamps: false // Opcional: desactiva createdAt y updatedAt si no los necesitas
});

// Hasheo de la contraseña antes de guardar
// Antes de guardar un nuevo usuario en la base de datos, su contraseña se encripta con bcrypt.
Usuario.beforeCreate(async (usuario) => {
    const salt = await bcrypt.genSalt(10); // Genera un "salt" (una cadena aleatoria) con un factor de costo de 10.
    usuario.pass = await bcrypt.hash(usuario.pass, salt); // Usa ese salt para hashear la contraseña del usuario antes de guardarla.
});



// Exporta el modelo Usuario, para que pueda ser utilizado en otros archivos, 
// como en controladores (controllers/usuariosController.js) o rutas (routes/usuarios.js).
module.exports = Usuario;
