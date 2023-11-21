const { verifyToken } = require("./auth");

function authMiddleware(req, res, next) {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Required authentication" });
  }

  token = req.header("Authorization").substring(7);

  try {
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decodedToken; // Stockez les informations de l'utilisateur dans l'objet de requête
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;

