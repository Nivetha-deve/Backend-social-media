import express from "express";
import jwt from "jsonwebtoken";
import { Post, User } from "../db-utils/models.js";

const postRouter = express.Router();

//create a new post

//Edit a post

//Delete a post 

//Read all the posts from a the logged in user

// Read the posts from other users --> to be shown in home page


//create a new post 
postRouter.post("/", async (req,res) => {
    const token = req.headers["authorization"];
    const postData = req.body;

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findOne({email: decoded.email});

        const poData = {
            ...postData,
            id: Date.now().toString(),
            userName: decoded.email,
            profilePic: user.image,
            likes: 0,
        };

     const newPost = new Post(poData);
     await newPost.save();

     res.status(201).json({message: "Post created successfully",
        newPost: poData,
     });
    }catch (err){
        res.status(500).send(err);
    }
});

//Read all the Posts from a the logged in user
postRouter.get("/", async (req,res) => {
    try{
      const token = req.headers["authorization"];
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      const posts = await Post.find({userName: decoded.email}, {_id:0, __v:0});
      res.send(posts);
    } catch (err) {
        console.log(err);
      res.status(500).send({msg: "Internal server error"});
    }
});

//Delete a post
postRouter.delete("/:postId", async (req,res) => {
    try{
      const postId =req.params.postId;
      await Post.deleteOne({id:postId});
      res.send({msg:"Post Delete Success"});
    }catch(err){
        console.log(err);
        res.status(500).send({msg:"Internal server Error"});
    }
});

//Read post from other users --> to be shown in home page
postRouter.get("/other-posts", async (req,res) => {
   try{
    const token =req.headers["authorization"];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const posts = await Post.find(
        {userName: {$ne: decoded.email}},
        {_id:0, __v:0}
    );
    res.send(posts);
   }catch(err) {
    console.log(err);
    res.status(500).send({msg: "Internal server error"});
   }
});

export default  postRouter;   