import { validateToken } from "../services";

export function checkForAuthCookie(cookieName) {
return(req, res, next) => {
    const token = req.cookies[cookieName];

    if (!token) return next();
    
    try {
        const payload = validateToken(token);
        req.user = payload;
        
    } catch (error) {}

      next();
    
    return next();
  }
}