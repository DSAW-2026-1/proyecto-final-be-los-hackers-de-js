const db = require("../../dbManager");

module.exports = async function (req, res, next) {
    try {
        // 1. Extraemos el UID del token (esto asume que el tokenValidator ya pasó)
        const { UID } = req.token.payload;

        // 2. Usamos el manager de Felipe para buscar si es vendedor
        // IMPORTANTE: Asegúrate de que Felipe haya creado la función 'findVendedorByUID'
        const vendedor = await db.findVendedorByUID(UID);

        if (!vendedor) {
            // Si no es vendedor, verificamos si es un usuario común para dar un mensaje claro
            const user = await db.findUserByUID(UID);
            if (user) {
                const msg = "Acceso denegado: Se requiere rol de vendedor.";
                console.warn(`[AUTH] ${msg} (UID: ${UID})`);
                
                // Usamos el sistema de logs de Felipe
                await db.log("WARN", "AuthVendedor", msg, { 
                    UID: user._id,
                    username: user.username 
                });
                
                return res.status(403).json({ error: msg });
            }
            return res.status(401).json({ error: "Token no asociado a un usuario válido." });
        }

        // 3. Si es vendedor, guardamos sus datos y continuamos
        req.vendedor = vendedor; 
        next();

    } catch (error) {
        console.error("Error en authVendedor:", error);
        res.status(500).json({ error: "Error interno de autenticación." });
    }
};