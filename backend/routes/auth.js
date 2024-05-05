import express from 'express';
import { signup, login, sendEmail, resetPassword, checkEmailExist } from '../controllers/auth.controller.js';


const route = express.Router();

// SignUp/login
route.post("/signup", signup);
route.post("/login", login);

// send reset password link
route.post("/send-email", sendEmail);

// reset password
route.post("/reset-password", resetPassword);

// cheking the user email alredy exist or not   
route.get("/check-email-exist", checkEmailExist);

export default route;