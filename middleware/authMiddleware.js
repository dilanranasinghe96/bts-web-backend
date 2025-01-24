export const checkRole = (requiredRoles) => {
    return (req, res, next) => {
      const user = req.user;
      if (!user || !requiredRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  };