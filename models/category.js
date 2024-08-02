const mongoose = require("mongoose");
const product = require("./product");


let categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    mainimage: String,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }],
});


const category = mongoose.model("category", categorySchema);
module.exports = category;

