import User from '../models/User.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import { CreateSuccess } from '../utils/success.js';
import { CreateError } from '../utils/error.js';
import UserToken from '../models/UserToken.js';

// SignUp Controller
export const signup = async (req, res, next) => { 
    try{
        // Generate a salt to use for hashing
        const salt = await bcrypt.genSalt(10); // 10 is the default salt rounds
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword
        });

        // Check for user existance.
        const user = await User.findOne({email: req.body.email});
        if(user)
        {
            // return res.status(400).send("User already exists, try with other email!!!");
            return next(CreateError(400, "User already exists, try with other email!!!"));
        }
        await newUser.save();
        return next(CreateSuccess(200, "User SignUp Successfully"));
    }catch (error){
        // return res.status(500).send("Internal Server Error");
        return next(CreateError(500, "Internal Server Error"));

    }
}

// Login Controller
export const login = async (req, res, next)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user)
        {
            // return res.status(404).send("User not found!");
            return next(CreateError(404, "User not found!"));
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect)
        {
            // return res.status(400).send("Password Incorrect!");
            return next(CreateError(400, "Password Incorrect!"));
        }
        const accessToken = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, { expiresIn: '7s' });

        const refreshToken = jwt.sign({
            id: user._id
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });

        // Store user ID in the request for later verification
        req.userId = user._id;

        res.cookie("access_token", accessToken, {httpOnly: true, path: '/', maxAge: 60 * 60 * 1000});

        res.cookie("refresh_token", refreshToken, { httpOnly: true, path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).send(CreateSuccess(200, "Logged in Successfully", user));

        // return next(CreateSuccess(200, "Logged in Successfully"));
    }catch(error){
        // return res.status(500).send("Internal Server Error");
        return next(CreateError(500, "Internal Server Error"));
    }
}

// sendEmail Controller
export const sendEmail = async (req, res, next) => {
    try{
        const email = req.body.email;
        console.log(email);

        // Get user for requested email
        const user = await User.findOne({email: {$regex: '^'+email+'$', $options: 'i'}});

        console.log("user: ",user);
        if(!user)
        {
            return next(CreateError(404, "User not found while reseting the password!"));
        }
        // Create a token
        const payload = {
            email: user.email,
        };
        const expiryTime = '5m';
        const token = jwt.sign(payload, process.env.RESET_PASSWORD_TOKEN_SECRET, {expiresIn: expiryTime});

        // Save the token in the database
        const newToken = new UserToken({
            user: user._id,
            token: token
        });

        // Send email
        const mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.APP_PASSWORD
            }
        });

        let mailDetails = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Link',
            html: `
            <html>
                <head>
                    <title>Password Reset Request</title>
                </head>
                <body>
                    <h1>Password Reset Request</h1>
                    <p>Dear ${user.username},</p>
                    <p>We have received a request to reset your password for your account with iNotes. To complete the password reset process, please click on the button below:</p><a href=${process.env.LIVE_URL}/reset-password/${token}><button style="background-color: #4CAF50; color: white; padding: 14px 20px; border: none; cursor: pointer; border-radius: 4px;">Reset Password</button></a>
                    <p>Please note that this link is only valid for a 5 minutes. If you did not request a password reset, please disregard this message.</p>
                    <p>Thank you,</p>
                    <p>iNotes Team</p>
                </body>
            </html>`
        };
        
        // Send email
        mailTransporter.sendMail(mailDetails, async (error, info) => {
            if(error){
                console.log(error);
                return next(CreateError(500, "Something went wrong while sending the email!"));
            }else{
                await newToken.save();
                return next(CreateSuccess(200, "Password reset link sent to your email successfully!"));
            }
        });
    }
    catch(error){
        return next(CreateError(500, "Internal Server Error"));
    } 
}

// resetPassword Controller
export const resetPassword = async (req, res, next) => {
    try{
        const token = req.body.token;
        const newPassword = req.body.newPassword;

        // Verify the token
        jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET, async (err, decoded) => {
            if(err){
                return next(CreateError(500, "Password reset link expired!"));
            }
            else{
                const payload = decoded;

                // Get user for requested email
                const user = await User.findOne({email: {$regex: '^'+payload.email+'$', $options: 'i'}});
                console.log(user);

                // Generate a salt to use for hashing
                const salt = await bcrypt.genSalt(10); // 10 is the default salt rounds

                // Hash the password
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                user.password = hashedPassword;

                try{
                    const updatedUser = await User.findByIdAndUpdate(
                        {_id: user._id},
                        {$set: user}, 
                        {new: true}
                    );
                    // await user.save();
                    return next(CreateSuccess(200, "Password reset successfully!"));
                }
                catch(error){
                    return next(CreateError(500, "Something Went Wrong while resetting the password!"));
                }
            }
        });
    }
    catch(error){
        return next(CreateError(500, "Internal Server Error"));
    }
}

// Check email exist already exist or not while signup
// I want to return the all emails of the users as an array from the database as a response
export const checkEmailExist = async (req, res, next) => {
    try{
        const users = await User.find({}, {email: 1});
        const emails = users.map(user => user.email);
        return next(CreateSuccess(200, "Emails fetched successfully", emails));
    }catch(error){
        return next(CreateError(500, "Internal Server Error"));
    }
}