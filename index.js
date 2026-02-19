//npm init for creating new js project
//index.js is entry point of the project
const express = require("express")
const app = express();

app.post("/user/signup", function(req, res){
    res.json({
        message: "signup endpoint"
    })
})


app.post("/user/signin", function(req, res){
    res.json({
        message: "signin endpoint"
    })
})


app.get("user/purchases", function(req, res){
    res.json({
        message: "user purchased course endpoint"
    })
})

app.post("course/purchases", function(req, res){
    res.json({
        message: "user course purchase endpoint"
    })
})

app.get("/courses", function(req, res){
    res.json({
        message: "course listing endpoint"
    })
})




app.listen(3000);