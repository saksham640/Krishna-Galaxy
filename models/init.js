const product = require("./product");
const brand = require("./brand");
const category = require("./category");
const mongoose = require("mongoose");
const MONGO_URL = `mongodb+srv://saksham:saksham12@cluster0.7jiaptp.mongodb.net/KrishnaGalaxy?retryWrites=true&w=majority&appName=Cluster0`;

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connection to db successful");
}

main().catch(err => {
    console.log(err);
}); 

let reset = async function(){
    await product.deleteMany({});
    await brand.deleteMany({});
}

let _10RSharpy = new product({
    name: "10R Sharpy",
    description: "Sahi hai boss",
    mainImage: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    images : ["https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60", "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"],
});

let jia = new brand({
    name: "JIA",
    description: "this is a light brand",
    mainImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    images : ["https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"],
});

let sharpy = new category({
    name: "Sharpy",
    description: "Sharpy is a high powered beam light",
    mainImage : "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",    
});


let save = async function(){

await _10RSharpy.save();
await sharpy.save();
await jia.save();
}

let find = async function(){
jia = await brand.findOne({name : "JIA"});
_10RSharpy = await product.findOne({name: "10R Sharpy"});
sharpy = await category.findOne({name: "Sharpy"});
jia.products.push(_10RSharpy);
sharpy.products.push(_10RSharpy);
await product.findByIdAndUpdate(_10RSharpy._id,{brand:jia});
await product.findByIdAndUpdate(_10RSharpy._id,{category:sharpy});
save();
console.log("pushed");
}

find();

