import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const authentication = async (req, res, next) => {
  // const token = req.header('Authorization');

  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.auth = decoded.auth;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
