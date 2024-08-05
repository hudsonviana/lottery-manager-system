import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const authentication = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const accessToken = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
    req.auth = decoded.auth;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
