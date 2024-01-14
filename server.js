const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;
const jwt = require('jsonwebtoken');
const {User,Code} = require('./db/modle.js');
const authMiddleware = require("./middleware.js")
const router = express.Router()
const getUserRouter = require('./serverRoutes/auth.js')
const getCodeRouter = require('./serverRoutes/code.js')
const getNoteRouter = require('./serverRoutes/note.js')
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB (replace 'your_database' and 'your_password' with your MongoDB credentials)
mongoose.connect('mongodb+srv://Abhishek:Abhishek@todo.gvvy95u.mongodb.net/snypupdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
    console.log("connected");
});

app.use('/auth',express.json(),getUserRouter);
app.use('/code',express.json(),getCodeRouter);
app.use('/note',express.json(),getNoteRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



