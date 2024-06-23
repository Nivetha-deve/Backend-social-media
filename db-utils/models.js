import mongoose from "mongoose";
const  Schema  = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, 
    default:"",
  },
  description: {
    type: String,
    default:"",
  },
  id:{
   type: String,
   required: true,
   unique: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"]
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create the User model
const User = mongoose.model('User', userSchema);

// post schema
const postSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
    unique:true,
  },
  userName: {
    type: String,
    required: true
  },
  likes: {
    type:Number,
    require: true,
  },
  profilePic: {
    type: String,
    required: true,
  },
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

export {User,Post};