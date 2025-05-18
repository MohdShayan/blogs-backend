import { validateToken } from "../services.js";

export function checkForAuthCookie(cookieName) {
return(req, res, next) => {
    const token = req.cookies[cookieName];

    if (!token) return next();
    
    try {
        const payload = validateToken(token);
        req.user = payload;
        
    } catch (error) {}
    
    return next();
  }
}