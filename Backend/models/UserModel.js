import mongoose from "mongoose"
import { genSalt, hash } from "bcrypt";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:[true,"Email is Required"],
        unique:true,
    },
    password:{
        type:String,
        require:[true,"Password is Required"],
    },
    firstName:{
        type:String,
        require:false,
    },
    lastName:{
        type:String,
        require:false,
    },
    image:{
        type:String,
        require:false,
    },
    color:{
        type:Number,
        require:false,
    },
    profileSetup:{
        type:Boolean,
        default:false
    },
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await genSalt();
    this.password = hash(this.password, salt);
    next();
});


const User = mongoose.model("Users",userSchema)

export default User;   