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
const imgbbUploader = require("imgbb-uploader");
const { Console } = require("console");


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

function splitByNewline(inputString) {
    return inputString.split('\r\n');
}

// Example usage:
const input = "Hello\r\nWorld\r\nThis is a test";
const result = splitByNewline(input);
console.log(result); // Output: ["Hello", "World", "This is a test"]



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
    let targetBrand = await brand.findOne({name: req.body.brand});
    let targetCategory = await category.findOne({name: req.body.category});
    let specsheet = splitByNewline(req.body.specifications);
    let mainimage = `C:/krishnagalaxy/${req.body.mainimage}`
    let img1 = `C:/krishnagalaxy/${req.body.img1}`
    let img2 = `C:/krishnagalaxy/${req.body.img2}`
    let img3 = `C:/krishnagalaxy/${req.body.img3}`

    let newProduct = new product({
        name: req.body.name,
        mainimage: extractImageText(req.body.mainimage),
        description: req.body.description,
        price: req.body.price,
        specifications: specsheet,
        category: targetCategory._id,
        brand: targetBrand._id,
    });
    await newProduct.save(); 

    await targetBrand.products.push(newProduct._id);
    await targetCategory.products.push(newProduct._id);

    await targetBrand.save();
    await targetCategory.save();

    
    await imgbbUploader("6ec2a3a46418c34ce73ee2dbbbc93cf8", mainimage)
    .then((response) => product.findByIdAndUpdate(newProduct._id,{mainimage: response.url}))
    .catch((error) => console.error(error));
    
        await imgbbUploader("6ec2a3a46418c34ce73ee2dbbbc93cf8", img1)
    .then((response) => newProduct.images.push(response.url))
    .catch((error) => console.error(error));
    
    await imgbbUploader("6ec2a3a46418c34ce73ee2dbbbc93cf8", img2)
    .then((response) => newProduct.images.push(response.url))
    .catch((error) => console.error(error));

    await imgbbUploader("6ec2a3a46418c34ce73ee2dbbbc93cf8", img3)
    .then((response) => newProduct.images.push(response.url))
    .catch((error) => console.error(error));

    await newProduct.save();
    console.log("added!");
    res.redirect("/");
});


app.get("/products/:id", async (req,res)=>{
    let targetProduct = await product.findById(req.params.id).populate("brand").populate("category");
    let targetBrand = await brand.findById(targetProduct.brand._id).populate("products");
    targetBrand.products = shuffleArray(targetBrand.products);
    res.render("productPage copy.ejs",{targetProduct,targetBrand});
});

app.post("/products/:id/delete", async (req,res)=>{
    let targetProduct = await product.findById(req.params.id).populate("brand").populate("category");

    if(req.body.pass == "live90200"){

    await brand.updateOne({_id: targetProduct.brand._id},{$pull:{products: targetProduct._id}});
    await category.updateOne({_id: targetProduct.category._id},{$pull:{products: targetProduct._id}});
    await product.findByIdAndDelete(targetProduct._id);
     res.redirect(`/brands/${targetProduct.brand.name}`);
    } else {
        res.redirect(`/products/${targetProduct._id}`);
    }
});

app.get("/exp",(req,res)=>{
    res.render("exp.ejs");
});

app.post("/exp",async (req,res)=>{
    console.log(req.body);
});

app.get("/brands/AudioX",async (req,res)=>{
    let AudioX = await brand.findOne({name: "AudioX"}).populate("products");
    res.render("AudioXMain.ejs",{AudioX});
});

app.get("/brands/N-LABS",async (req,res)=>{
    let NLABS = await brand.findOne({name: "N-LABS"}).populate("products");
    res.render("N-LABSMain.ejs",{NLABS});
});

app.post("/products/:id/update",async (req,res)=>{
    let targetProduct = await product.findById(req.params.id).populate("brand").populate("category");
    if(req.body.pass == "live90200"){
        res.render("updateProduct.ejs",{targetProduct});
    }else{
        res.redirect(`/products/${targetProduct._id}`);
    }
});

app.post("/products/:id/update/success",async (req,res)=>{

    let targetProduct = await product.findOne({_id:req.params.id});
    let mainimage = `C:/krishnagalaxy/${req.body.mainimage}`;
    let img1 = `C:/krishnagalaxy/${req.body.img1}`;
    let img2 = `C:/krishnagalaxy/${req.body.img2}`;
    let img3 = `C:/krishnagalaxy/${req.body.img3}`;


    if(req.body.mainimage != ``){
        await imgbbUploader("6ec2a3a46418c34ce73ee2dbbbc93cf8", mainimage)
    .then((response) => targetProduct.updateOne({mainimage: response.url}))
    .catch((error) => console.error(error));
    }

    if(req.body.img1 != ``){
        await imgbbUploader("6ec2a3a46418c34ce73ee2dbbbc93cf8", img1)
    .then((response) => targetProduct.images.push(response.url))
    .catch((error) => console.error(error));
    }
    if(req.body.img2 != ``){
        await imgbbUploader("6ec2a3a46418c34ce73ee2dbbbc93cf8", img2)
    .then((response) => targetProduct.images.push(response.url))
    .catch((error) => console.error(error));
    }
    if(req.body.img3 != ``){
        await imgbbUploader("6ec2a3a46418c34ce73ee2dbbbc93cf8", img3)
    .then((response) => targetProduct.images.push(response.url))
    .catch((error) => console.error(error));
    }
    await targetProduct.save();

    await product.findByIdAndUpdate(targetProduct._id,{name: req.body.name});
    await product.findByIdAndUpdate(targetProduct._id,{description: req.body.description});
    await product.findByIdAndUpdate(targetProduct._id,{price: req.body.price});
    await product.findByIdAndUpdate(targetProduct._id,{specifications: req.body.specifications});

    await targetProduct.save();

    res.redirect(`/products/${req.params.id}`);

});

app.get("/brands/Zenith",async (req,res)=>{

    let Zenith = await brand.findOne({name: "Zenith"}).populate("products");
    console.log(Zenith);
    res.render("ZenithMain.ejs",{Zenith});
})

app.get("/categories/:name",async (req,res)=>{

    let targetCategory = await category.findOne({name:req.params.name}).populate("products");

    res.render("categoryPage.ejs",{targetCategory});
})



