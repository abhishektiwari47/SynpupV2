
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware.js");
const { User ,Code, CodeList, Note} = require("../db/modle.js");
const { default: mongoose, Mongoose } = require("mongoose");




router.put("/editNote",authMiddleware,async (req,res)=>{
    const coder = req.headers.userId;
    const note = req.body.note;
    try{
    const existingNote = await Note.findOne({coder});
    if(existingNote){
    const response = await Note.findOneAndUpdate({coder},{$set:{note:note},},{new:true});
    console.log("we are here")
}
    else{
      const newNote = new Note({
        coder:coder,
        note:note
      });
      const response = await newNote.save();
      console.log(response);
    }
  
    res.status(200).json("Note Edited")
  
  }
    catch(e){
      console.log(e);
      res.status(500).json(e)
    }  
  
  
  });

  module.exports = router;