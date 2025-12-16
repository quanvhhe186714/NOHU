const jwt = require("jsonwebtoken");

function auth(requiredRoles) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: missing token" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || "hacknohu-secret"
      );

      if (
        Array.isArray(requiredRoles) &&
        requiredRoles.length > 0 &&
        !requiredRoles.includes(payload.role)
      ) {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: insufficient role" });
      }

      req.user = payload;
      next();
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: invalid token" });
    }
  };
}

module.exports = {
  auth,
};


