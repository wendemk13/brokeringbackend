// Simulate a logged-in user (replace with real JWT/auth logic)
const authMiddleware = (req, res, next) => {
    req.user = { id: 2 }; 
    next();
};

export default authMiddleware;
  