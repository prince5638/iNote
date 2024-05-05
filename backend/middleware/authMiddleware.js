import jwt from 'jsonwebtoken';
import { CreateError } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
    const access_token = req.cookies.access_token;
    const refresh_token = req.cookies.refresh_token;

    if(!access_token){
        return next(CreateError(401, "Unauthorized: No access token provided"));
    }

    try {
        // Verify the access token
        const access_token_decoded = jwt.verify(access_token, process.env.JWT_SECRET);
        req.userId = access_token_decoded.id;

        // If the access token is valid, continue to the next middleware
        next();
    } catch (access_token_error) {
        // If access token is expired or invalid, check the refresh token
        if(!refresh_token){
            return next(CreateError(401, "Unauthorized: No refresh token provided"));
        }

        try {
            // Verify the refresh token
            const refresh_token_decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

            // If the refresh token is valid, generate a new access token
            const newAccessToken = jwt.sign({
                id: refresh_token_decoded.id
            }, process.env.JWT_SECRET, { expiresIn: '7s' }); // Adjust expiration time as needed

            // Set the new access token in the response cookie
            res.cookie("access_token", newAccessToken, { httpOnly: true, path: '/', maxAge: 60 * 60 * 1000 });

            // Attach the user ID to the request object
            req.userId = refresh_token_decoded.id;

            // Continue to the next middleware
            next();
        } catch (refresh_token_error) {
            if(refresh_token_error.name === "TokenExpiredError"){
                // If refresh token is expired, return an error
                return next(CreateError(401, "Unauthorized: Refresh token expired"));
            }
            else{
                // If refresh token is invalid, return an error
                return next(CreateError(401, "Unauthorized: Invalid tokens"));
            }
        }
    }
}
