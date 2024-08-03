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
const category = require("./models/category");
const product = require("./models/product");
const brand = require("./models/brand");


//functions
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) { 
   
        // Generate random number 
        var j = Math.floor(Math.random() * (i + 1));
                   
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
       
    return array;
 }

 function replaceNewlineInstances(inputString) {
    // Use a regular expression to find instances of "\r\n"
    const regex = /\r\n/g;
    // Replace the found instances with a newline character
    const resultString = inputString.replace(regex, '\n');
    return resultString;
}

function extractImageText(inputString) {
    const startTag = "[img]";
    const endTag = "[/img]";
    
    const startIndex = inputString.indexOf(startTag) + startTag.length;
    const endIndex = inputString.indexOf(endTag);
    
    if (startIndex < startTag.length || endIndex === -1 || startIndex >= endIndex) {
        return ""; // Return an empty string if tags are not found or in the wrong order
    }
    
    return inputString.substring(startIndex, endIndex);
}

// Example usage:
const exampleString = "Here is an image: [img]This is the image text[/img] and some more text.";
console.log(extractImageText(exampleString)); // Output: "This is the image text"


const app = express();
const port = 8080;
let loggedIn = {status: 0, username: ''};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);

const MONGO_URL = `mongodb+srv://saksham:saksham12@cluster0.7jiaptp.mongodb.net/KrishnaGalaxy?retryWrites=true&w=majority&appName=Cluster0`;

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
app.get("/",async(req,res)=>{
    let allProducts = await product.find();
    let allCategories = await category.find().populate("products");
    let allBrands = await brand.find().populate("products");
    res.render("home.ejs",{allProducts, allBrands, allCategories});
});

app.get("/owner/addProduct",(req,res)=>{
    res.render("addProduct.ejs");
})
app.post("/owner/addProduct",async(req,res)=>{
    console.log(req.body);
    let targetBrand = await brand.findOne({name: req.body.brand});
    let targetCategory = await category.findOne({name: req.body.category});
    let newProduct = new product({
        name: req.body.name,
        mainimage: extractImageText(req.body.mainimage),
        description: req.body.description,
        price: req.body.price,
        specifications: req.body.specifications,
        category: targetCategory._id,
        brand: targetBrand._id,
    });

    await newProduct.save(); 

    await targetBrand.products.push(newProduct._id);
    await targetCategory.products.push(newProduct._id);

    await targetBrand.save();
    await targetCategory.save();

    console.log("added!");
    res.redirect("/");
});



