const jwt = require('jsonwebtoken');

const authMiddleware = async (req,res,next) => {
    const SECRET = "SECRET";
    const token = req.headers.authorization;
  
    // Check if the token starts with "Bearer "
    
    // Extract the token from the "Bearer " prefix
    const jwtToken = token.split(" ")[1];
  
    try {
        const decoded = jwt.verify(jwtToken, 'SECRET');
        console.log(decoded);
        req.headers.userId= await decoded.username;
        next();
    } catch (error) {
        console.log("error");
    }
  };
  

module.exports = authMiddleware;
