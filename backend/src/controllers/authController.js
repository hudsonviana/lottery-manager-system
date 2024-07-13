import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  const password = 'teste';

  const salt = await bcrypt.genSalt(12);
  const passwordHashed = await bcrypt.hash(password, salt);

  res.json({ password: passwordHashed });
};

export const login = async (req, res) => {};
