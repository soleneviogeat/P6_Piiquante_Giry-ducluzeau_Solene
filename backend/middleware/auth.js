const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
    console.log("a")
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
       console.log(token)
	next();
   } catch(error) {
    console.log("b")
       res.status(401).json({ error });
   }
};
