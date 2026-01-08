// Importamos la librería 'jsonwebtoken' que nos permite trabajar con JWT (JSON Web Tokens)
const jwt = require('jsonwebtoken');

// Definimos un middleware llamado 'auth' que se usará para proteger rutas
function auth(req, res, next) {
  // Obtenemos el encabezado 'authorization' de la petición HTTP
  const authHeader = req.headers['authorization'];

  // Si no existe el encabezado, respondemos con un error 401 (no autorizado)
  if (!authHeader) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  // El encabezado normalmente viene en el formato: "Bearer <token>"
  // Aquí separamos por espacio y tomamos la segunda parte (el token)
  const token = authHeader.split(' ')[1];

  // Si no hay token después de 'Bearer', devolvemos error 401
  if (!token) {
    return res.status(401).json({ message: 'Formato de autorización inválido' });
  }

  try {
    // Verificamos el token usando la clave secreta definida en las variables de entorno
    // Si no existe 'process.env.JWT_SECRET', usamos 'SECRET_KEY' como valor por defecto
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY');

    // Guardamos la información decodificada del token en 'req.user'
    // Esto nos permite acceder a datos como { id, email } en las rutas protegidas
    req.user = decoded; // 🔑 Aquí tendrás { id, email } si lo incluyes en el payload

    // Llamamos a 'next()' para continuar con la ejecución de la siguiente función/ruta
    next();
  } catch (err) {
    // Si el token es inválido o ya expiró, respondemos con error 403 (prohibido)
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}

// Exportamos el middleware para poder usarlo en otros archivos (ej. rutas protegidas)
module.exports = auth;