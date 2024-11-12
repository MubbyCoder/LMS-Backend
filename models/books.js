const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, "Please provide a title"],
        unique:true,
        trim:true,
    },
    author:{
        type:String,
        required:[true, "Please provide an author"],
        trim:true,
        unique:true,
    },
    copy:{
        type:Number,
        required:[true, "Please provide number of copies"],
        trim:true,
    },
    image:{
        type:String,
        required:[true, "Image is required"],
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    isAvailable:{
        type:Boolean,
        default:true,
    },
    NumberOfPages:{
        type:Number,
        required:[true, "Please provide the number of pages"],
    },
    category:{
        type:String,
        required:[true, "Please provide a category"],
    },
    description:{
        type:String,
        required:[true, "Please provide a description"],
    }
});

const Books = mongoose.model("Books", bookSchema);

module.exports = Books;