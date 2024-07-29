const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const app = express();
const port = 8080;

//global variables
MONGO_URL = 'mongodb://localhost:27017/krishnaGalaxy';

//path settings
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

//middlewares
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

//ejs-mate
app.engine('ejs', ejsMate);

//mongoose connect
async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connection to db successful");
}

main().catch(err => {
    console.log(err);
}); 

app.listen(port, ()=>{
    console.log("server is on");
});

//routes
app.get("/",(req,res)=>{
    res.render('homePage.ejs');
});


