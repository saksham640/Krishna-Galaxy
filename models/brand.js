const mongoose = require("mongoose");
const product = require("./product");


let brandSchema = new mongoose.Schema({
    name: String,
    description: String,
    mainimage: String,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }],
});


const brand = mongoose.model("brand", brandSchema);
module.exports = brand;

