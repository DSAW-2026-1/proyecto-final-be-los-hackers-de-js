const jwt = require('jsonwebtoken');
// Importamos el modelo de usuario para validar el UID contra la base de datos
const User = require('../../models/User'); 

/**
 * Middleware para validar que el usuario sea un vendedor autorizado.
 * Ubicación: /middleware/auth/sellerCheck
 */
const sellerCheck = async (req, res, next) => {
    // 1. Validar que la petición tenga el header de Authorization
    const authHeader = req.header('Authorization');

    // Retorna 400 si no existe el token o no empieza con 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ error: "No JWT token provided" });
    }

    // Extraer el token eliminando el prefijo 'Bearer '
    const token = authHeader.split(' ')[1];

    try {
        // 2. Validar la firma del token y su vigencia (JWT_SECRET debe estar en tu .env)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Verificar que el UID corresponda a un usuario real en la base de datos
        // Usamos await porque la consulta a la BD es asíncrona
        const existingUser = await User.findById(decoded.UID);
        
        if (!existingUser) {
            return res.status(400).json({ error: "Invalid JWT token" });
        }

        // 4. Verificar que la propiedad isSeller sea true en el payload del token
        if (decoded.isSeller !== true) {
            return res.status(403).json({ error: "You are not allowed to do this" });
        }

        // Si todas las validaciones pasan, adjuntamos la info del usuario al request
        req.user = decoded;
        
        // Permite el acceso al siguiente controlador (destino)
        next();

    } catch (error) {
        // Si el token expiró o la firma es falsa, entra en este bloque
        // Retorna 400 según los requisitos del tiquet
        return res.status(400).json({ error: "Invalid JWT token" });
    }
};

module.exports = sellerCheck;
