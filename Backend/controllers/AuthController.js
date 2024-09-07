import pkg from "jsonwebtoken";
const { sign } = pkg;
import User from "../models/UserModel.js";
import { response } from "express";
import { compare } from "bcrypt";
import { renameSync, unlinkSync} from "fs";
const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userID) => {
    return sign({ email, userID }, process.env.JWT_KEY, { expiresIn: maxAge });
}

export const signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password are required")
        }
        const user = await User.create({ email, password });

        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        });

        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                password: user.password,
                profileSetup: user.profileSetup
            },

        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Email and Password are required")
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send("User Not Found!");
        }
        const auth = await compare(password, user.password);

        if (!auth) {
            res.status(400).send("Password Is Incorrect");
        }

        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None"
        });

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                password: user.password,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
            },

        })
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}

export const getUserInfo = async (req, res, next) => {
    try {
        // console.log(req.userId);
        const userData = await User.findById(req.userId);
        if (!userData) {
            return res.status(404).send("User Not Found");
        }

        return res.status(200).json({

            id: userData.id,
            email: userData.email,
            password: userData.password,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color
        })

    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const { userId } = req;
        const { firstName, lastName, color } = req.body;
        if (!firstName || !lastName) {
            return res.status(400).send("All are required");
        }
        const check = await User.findById(userId);
        const userData = await User.findByIdAndUpdate(userId, {
            firstName, lastName, color, profileSetup: true
        }, { new: true, runValidators: true })

        return res.status(200).json({
            id: userData.id,
            email: userData.email,
            password: userData.password,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color
        })

    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}

export const addProfileImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("Image is required");
        } 

        const date = Date.now();
        let fileName = `uploads/profiles/${date}${req.file.originalname}`;

        renameSync(req.file.path, fileName);

        const updateUser = await User.findByIdAndUpdate(req.userId, {
            image: fileName
        }, { new: true, runValidators: true });

        return res.status(200).json({
            image: updateUser.image,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}


export const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId); 
        if(!user){
            return res.status(404).send('User Not Found');
        }
        if(user.image){
            unlinkSync(user.image);
        }
        user.image = null;
        await user.save();

        return res.status(200).json({
            messege: 'Profile Image Removed Successfully'
        })

    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}
