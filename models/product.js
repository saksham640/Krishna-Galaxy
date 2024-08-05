const mongoose = require("mongoose");
const brand = require("./brand");
const category = require("./category");

let productSchema = new mongoose.Schema({
    name: String,
    description: String,
    mainimage: String,
    images: [String],
    price: Number,
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"category",
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand",
    },
    specifications: [String],

});

const product = mongoose.model("product", productSchema);
module.exports = product;

