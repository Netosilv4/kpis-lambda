import jwt from 'jsonwebtoken';

const jwtOptions = {
    expiresIn: "1d",
}

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const generateToken = (user: any) => {
    const token = jwt.sign(user, JWT_SECRET, jwtOptions);
    return token;
}

export const validateToken = (token: string) => {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
}

