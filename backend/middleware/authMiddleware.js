const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Obtener el token del header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ msg: 'No hay token, autorización denegada' });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Agregar el userId al objeto request
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};

module.exports = authMiddleware;