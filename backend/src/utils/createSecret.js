import crypto from 'crypto';

export const generateSecretToken = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

export const createResetPasswordToken = () => {
  const resetToken = generateSecretToken(32);
  const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
};

// createResetPasswordToken();

// const secretToken = generateSecretToken(32); // Generate a 32-byte (64 hex characters) secret token
// console.log(secretToken);
