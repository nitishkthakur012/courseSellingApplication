const {Router, response} = require("express");
const bcrypt = require('bcrypt')
const {userModel} = require("../db");
const jwt = require("jsonwebtoken");
const {z} = require("zod")
require("dotenv").config()
const JWT_USER_PASSWORD = process.env.JWT_USER_SECRET; 

const userRouter = Router();


    userRouter.post("/signup", async function(req, res){
        const {email, password, firstName, lastName} = req.body; 
     
        const requiredBody = z.object({
            email: z.string().min(3).max(100).email(),
            password: z.string().min(3).max(100),
            firstName: z.string().min(3).max(100),
            lastName: z.string().min(3).max(100)
        })

        const parsedDataWithSuccess = requiredBody.safeParse(req.body);
        if(!parsedDataWithSuccess.success){
            res.json({
                message: "Incorrect format",
                error: parsedDataWithSuccess.error
            })
            return;
        }

        let errorThrown = false;
        try{
            const hashedPassword = await bcrypt.hash(password, 5);

            await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })

        }catch(e){
            console.log(e);
            res.status(500).json({
                message: "Something went wrong",
            });
            errorThrown = true;
        }
        if(!errorThrown){
            res.json({
            message: "Signup succeeded"
        })
        }
    })
    
     
    userRouter.post("/signin",async function(req, res){
        const {email, password} = req.body; 
        const user = await userModel.findOne({
            email: email
        });

        if(!user){
            res.status(403).json({
                message: "incorrect credentials"
            });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(passwordMatch){
            const token = jwt.sign({
                id: user._id
            }, JWT_USER_PASSWORD);

            res.json({
                token : token
            })
        }else{
            res.status(403).json({
                message: "Incorrect credentials"
            })
        }
    });
    
    
    userRouter.get("/purchases", function(req, res){
        res.json({
            message: "user purchased course endpoint"
        })
    })


module.exports = {
    userRouter : userRouter
}