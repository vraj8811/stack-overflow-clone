const mongoose = require("mongoose");


module.exports.connect = async () => {
    try {
        await mongoose.connect(`mongodb+srv://admin:Prabhat120@prabhatapi.wi2pzmu.mongodb.net/stackOverflowClone?retryWrites=true&w=majority&appName=PrabhatApi`,
        ).then(() => console.log("MongoDB is connected successfully"))
    }
    catch (err) {
        console.error(err.message)
    }
};