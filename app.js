const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const { hashSync, compareSync } = require("bcrypt");
const cookieParser = require("cookie-parser");
const mongoStore = require("connect-mongo");


const app = express();
const port = 8080;
let loggedIn = {status: 0, username: ''};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);

const MONGO_URL = `mongodb+srv://saksham:saksham12@cluster0.7jiaptp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    res.render("homePage.ejs");
});


