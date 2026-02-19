const {Router} = require('express')
const courseRouter = Router();



    courseRouter.post("/purchases", function(req, res){
        res.json({
            message: "user course purchase endpoint"
        })
    })
    
    courseRouter.get("/preview", function(req, res){
        res.json({
            message: "course listing endpoint"
        })
    })




module.exports = {
    courseRouter : courseRouter
}