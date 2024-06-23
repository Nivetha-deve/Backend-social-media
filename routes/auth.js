import { User } from "../db-utils/models.js";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

//Register
router.post("/register", async (req,res) => {
    const {name, image, description, id= Date.now(), dob, email, password } = req.body;

    try{
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({message: "User alraedy exists "});
        }
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            name,
            image,
            description,
            id,
            dob,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
     } catch (error) {
        res.status(500).json({ message: "Server error", error});
     }
});

//Login
router.post("/login", async (req,res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) {
          return res.status(400).json({message: "Invalid email or password" })
        }

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        const token = jwt.sign({id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, dob: user.dob, description:user.description, image: user.image },
        });
    } catch (error) {
        console.error("Server error:", error);
      res.status(500).json({ messsage: "Server error", error });
    }
});

export default router;
