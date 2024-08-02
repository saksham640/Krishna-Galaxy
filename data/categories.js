const category = require("../models/category");
const mongoose = require("mongoose");

const MONGO_URL = `mongodb+srv://saksham:saksham12@cluster0.7jiaptp.mongodb.net/KrishnaGalaxy?retryWrites=true&w=majority&appName=Cluster0`;

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connection to db successful");
}

main().catch(err => {
    console.log(err);
}); 