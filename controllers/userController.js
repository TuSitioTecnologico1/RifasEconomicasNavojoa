// controllers/userController.js
const Usuario = require('../models/Usuario'); // Es el modelo de la base de datos que representa la tabla users_login.
const bcrypt = require('bcrypt'); // Se usa para comparar la contraseña ingresada con la almacenada (que está encriptada).
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken



// Función para autenticar el usuario
const loginUser = async (username, pass) => {
    try {
        const usuario = await Usuario.findOne({ where: { username } });

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        const isMatch = await bcrypt.compare(pass, usuario.pass);

        if (!isMatch) {
            throw new Error('Credenciales incorrectas');
        }

        const token = jwt.sign(
            { userId: usuario.id, username: usuario.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { usuario, token };
    } catch (error) {
        throw error;
    }
};



// Función para obtener todos los usuarios
const obtenerUsuarios = async () => {
    try {
        const usuarios = await Usuario.findAll();
        return usuarios;
    } catch (error) {
        throw error;
    }
};



module.exports = { loginUser, obtenerUsuarios };
