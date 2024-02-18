
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware.js");
const { User } = require("../db/modle.js");
const jwt = require('jsonwebtoken');

router.get("/getUser", authMiddleware, async (req,res)=>{
   

  
    res.json(req.headers.userId)
})

// Handle signup endpoint
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Create a new user in the database
    const existingUser = await User.findOne({username});
    if(existingUser){
      console.log("user exists");
      res.status(501).json({message:"user exists"});
    }
    else{
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });}
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/login",async (req,res)=>{
  const {username,password} =req.body;
 let user= await User.findOne({username,password});

 if(user){
  const jwtToken = jwt.sign({ username: username, password: password }, 'SECRET', {
    expiresIn: '12d', // Adjust the expiration time as needed
  });
  return res.json(jwtToken);
 }
 else{
  return res.json("not found");
 }
})

module.exports = router;