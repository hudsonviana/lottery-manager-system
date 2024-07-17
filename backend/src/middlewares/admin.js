import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const authentication = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.auth.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado, administrador apenas' });
    }

    req.auth = decoded.auth;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
