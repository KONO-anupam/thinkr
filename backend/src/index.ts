import express from "express";
import mongoose  from "mongoose";
import jwt from "jsonwebtoken"
import { contentModel, linkModel, userModel } from "./db.js";
import { useMatch } from "react-router-dom";
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());


app.post("/api/v1/signup", async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password,10)

    try{
    await userModel.create({
        username: username,
        password: hashedPassword
    })

    res.json({
        message: "user signed up!"
    })
    }
    catch(e){
        res.status(500).json({
            message: "user already exists"
        })
    }
})

app.post("/api/v1/signin",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await userModel.findOne({
        username,
        password
    })
    if(existingUser){
        const token = jwt.sign({
            id: existingUser._id
        },JWT_PASSWORD)

        res.json({
           message: 'you are signed in' 
        })
    }
    else{
        res.status(403).json({
            message: "incorrect credentials"
        })
    }


})

app.post("/api/v1/content",userMiddleware, async (req,res)=>{
    const link = req.body.link;
    const type = req.body.type;
    await contentModel.create({
        link,
        type,
        //@ts-ignore
        userId:req.userId,
        tags: []
    })

    res.json({
        message: 'content added'
    })

})

app.get("/api/v1/content",userMiddleware, async (req,res)=>{
    // @ts-ignore
    const userId = req.body.userId
    const content = contentModel.find({
        userId: userId
    }).populate("userId","username")
    res.json({
        message: 'content found'
    })
})

app.delete("/api/v1/content",userMiddleware, async (req,res)=>{
    const userId = req.body.userId;
    const contentId = req.body.contentId;

    await contentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId : req.userId
    })

})

import crypto from "crypto";

app.post("/api/v1/brain/share",  async (req, res)=>{
    const userId = req.body.userId
    const hash = crypto.randomBytes(6).toString("base64url");
    try{
        const created = await linkModel.create({
            hash,
            userId
        })
       return res.json({
            message: 'link created',
            shareLink: '/api/v1/brain/${created.hash}'
        })
    }
    catch(e){
        return res.status(500).json({
            message: "could not create share link"
        })
    }
})

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const { shareLink } = req.params;
  try {
    const linkDoc = await linkModel.findOne({ hash: shareLink }).lean();
    if (!linkDoc) return res.status(404).json({ message: "share not found" });

    const content = await contentModel
      .find({ userId: linkDoc.userId })
      .populate("tags", "title")
      .populate("userId", "username")
      .lean();

    return res.json({ owner: linkDoc.userId, content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "could not open share" });
  }
});




app.listen(3000);