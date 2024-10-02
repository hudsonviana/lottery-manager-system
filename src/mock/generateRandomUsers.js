import { faker } from '@faker-js/faker';

const generateRandomUsers = (numUsers) => {
  const roles = ['USER', 'ADMIN'];
  const users = [];

  for (let i = 0; i < numUsers; i++) {
    const user = {
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      role: roles[Math.floor(Math.random() * roles.length)],
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    };
    users.push(user);
  }

  return users;
};

export default generateRandomUsers;
