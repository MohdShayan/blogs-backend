import jwt from "jsonwebtoken";

const secret = "@#Shayan_Blog222#@";

export function createTokenForUser(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    profileImg: user.profileImg,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

export function validateToken(token) {
  if (!token) return null;
  const payload = jwt.verify(token, secret);
  return payload;
}
