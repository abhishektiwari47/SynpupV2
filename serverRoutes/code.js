const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware.js");
const { User ,Code, CodeList, Note} = require("../db/modle.js");
const { default: mongoose, Mongoose } = require("mongoose");

router.post("/addCode" ,authMiddleware,async (req,res)=>{
      const {title,code,language}= req.body;
      const coder = req.headers.userId;
      const copied = 0;
      try{
        const newCode = new Code({
            title,code,coder,copied,language
        });
        
        const response = await newCode.save();
        if(response._id){
          try{
            const _id = response._id;
            const existingCodeList = await CodeList.findOne({coder})
            if(existingCodeList){
               const list = existingCodeList.codeList;
               console.log("this is list")
               console.log(list);
               const newCodeListItem = {
                title:title,
                codeId:_id
               }
               
              const kk = await CodeList.findOneAndUpdate({coder},{ $push: { codeList: newCodeListItem }},{new:true},);
              console.log(kk);

            }
            else{

              const newCodeListItem = {
                title:title,
                codeId:_id
               }
              const newCodeList = new CodeList({
                codeList:[newCodeListItem],
                coder:coder
              })
              const kk = await newCodeList.save();
             
            }
          }
          catch(e){
            console.log(e);
          }
          
        }
        console.log("Message Saved");
        res.status(200).send({message:"Code saved"});
      }
      catch(e){
        console.log(e);
         res.status(500).send({message:toString(e)});
      }
})

router.get("/getCode/:codeId",async (req,res)=>{
   const {codeId} = req.params;
   const code = await Code.find({_id:codeId});
   if(code){
    res.json(code);
   }
   else{
    res.status(500).json({message:"can't get code"})
   }
})

router.get("/getCodeList",authMiddleware,async (req,res)=>{
  try{  const coder = req.headers.userId;
    const response = await CodeList.findOne({coder});
    console.log(response)
    const codeList = response.codeList;
    res.status(200).json(codeList)
  }
  catch(e)
  {
    res.status(500).json({"err":"There was an error"})
  }
})

router.delete("/deleteCode",authMiddleware,async (req,res)=>{
  if(req.headers.userId){
    const codeId = req.body.codeId;
    const coder=req.headers.userId;
    try{
      const response = await Code.findOneAndDelete({_id:codeId},{new:true});
      try{
      let {codeList} = await CodeList.findOne({coder});
     
      

      codeList = codeList.filter((element)=>{
        const codeIdAsString = String(element.codeId);
        return codeIdAsString !== codeId});
      console.log("after delete")
      console.log(codeList)
      const response2 = await CodeList.findOneAndUpdate(
        { coder },
        { $set: { codeList } },
        { new: true }
      );
       console.log(response)
       res.status(200).json({response2})
      }
      catch(e){
        console.log(e);
        res.status(500).json({"message":e});
      }
      
        
    }
    catch(e){
      console.log(e);
      res.send(toString(e));
    }
  }
});

router.put("/editCode/:codeId",authMiddleware,async (req,res)=>{
  const coder = req.headers.userId;
  if(coder){
    const {codeId} = req.params;
    const {title,code,language} = req.body;
    try{
       const _id = new mongoose.Types.ObjectId(codeId)
       const response = await Code.findOneAndUpdate(
        {_id},
        {$set:{title,code,language}},{new:true});
        try{
          const existingCodeList = await CodeList.findOne({coder})
          if(existingCodeList){
             const list = existingCodeList.codeList;
             console.log("this is list")
             console.log(list);
             const newCodeListItem = {
              title:title,
              codeId:_id
             }
             const kk = await CodeList.findOneAndUpdate(
              { coder, "codeList.codeId": _id },
              { $set: { "codeList.$": newCodeListItem } },
              { new: true }
            );
            console.log(kk);

          }
          else{
            const newCodeListItem = {
              title:title,
              codeId:_id
             }
            const newCodeList = new CodeList({
              codeList:[newCodeListItem],
              coder:coder
            })
            const kk = await newCodeList.save();
            console.log("This is codeList");
            console.log(kk);
           
          }
        }
        catch(e){
          console.log(e);
        }
       res.status(200).json({message:"updated"});
    }
    catch(e){
      console.log(e);
      res.status(500).json({message:"not updated"});
    }
  }
});





module.exports = router;