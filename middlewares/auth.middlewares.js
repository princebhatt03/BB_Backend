const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.admin) {
    return res.status(401).json({ error: 'Unauthorized' });
    
  }
  next();
};

module.exports = authMiddleware;
