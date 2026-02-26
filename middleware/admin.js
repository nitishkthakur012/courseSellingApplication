const jwt = require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD } = require("../config"); 

function userMiddleware(req, res, next){
    const token = req.headers.token; //can in auth too
    const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);

    if(decoded){
        req.adminId = decoded.id;
        next();
    }else{
        res.status(403).json({
            message: "You are not signed in"
        })
    }
}

module.exports = {
    adminMiddleware: adminMiddleware
}