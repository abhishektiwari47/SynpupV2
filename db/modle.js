const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
  });
const codeSchema = new mongoose.Schema({
    title: String,
    code:String,
    coder:String,
    copied:Number,
    language:String,
});
const codeListSchema = new mongoose.Schema({
  codeList:[
    {title:String,
    codeId:mongoose.Schema.Types.ObjectId}
  ],
  coder:String
})
const stickyNoteSchema = new mongoose.Schema({
  coder:String,
  note:String,
})

const User = mongoose.model('User', userSchema);
const Code = mongoose.model('Code',codeSchema);
const CodeList = mongoose.model('CodeList',codeListSchema);
const Note = mongoose.model('Note',stickyNoteSchema)
module.exports = {User,Code,CodeList,Note};