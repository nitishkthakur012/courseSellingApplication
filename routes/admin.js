const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const {z} = require("zod")
const bcrypt = require("bcrypt");
const {JWT_ADMIN_PASSWORD} = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async function (req, res) {
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

            await adminModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })

        }catch(e){
            console.log(e);
            res.status(500).json({
                message: "Something went wrong"
            });
            errorThrown = true;
        }
        if(!errorThrown){
            res.json({
            message: "Signup succeeded"
        })
        }
});

adminRouter.post("/signin",async function (req, res) {
  const {email, password} = req.body; 
        const admin = await adminModel.findOne({
            email: email
        });

        if(!admin){
            res.status(403).json({
                message: "Incorrect credentials"
            });
            return;
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if(passwordMatch){
            const token = jwt.sign({
                id: admin._id
            }, JWT_ADMIN_PASSWORD);

            res.json({
                token : token
            })
        }else{
            res.status(403).json({
                message: "Incorrect credentials"
            })
        }
});

//endpoint for admin to create a course
adminRouter.post("/course", adminMiddleware, async function (req, res) {
    const adminId = req.adminId;

    const {title, description, imageUrl, price} = req.body;
    //better if admin can directly upload the image, here takin url
    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price, 
        creatorId: adminId
    })

  res.json({
    message: "Course created",
    courseId: course._id
  });
});

//endpoint for admin to update the course(title, price etc)
adminRouter.put("/course", adminMiddleware, async function (req, res) {
  const adminId = req.adminId;

    const {title, description, imageUrl, price, courseId} = req.body;
    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    },{
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price
    })

  res.json({
    message: "Course updated",
    courseId: course._id
  });
});

//endpoint for admin to get back all the course that they had created
adminRouter.get("/course/bulk", adminMiddleware,async function (req, res) {
   const adminId = req.adminId;

    const courses = await courseModel.find({
        creatorId: adminId
    });

  res.json({
    message: "Course List",
    courses
  });
});

module.exports = {
  adminRouter: adminRouter,
};
