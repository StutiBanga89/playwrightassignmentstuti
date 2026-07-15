import { Faker } from './faker';

const firstName = Faker.person.firstName();
const middleName = Faker.person.middleName();
const lastName = Faker.person.lastName();

export const employeeData = {
  firstName,
  middleName,
  lastName,
  empNumber: Faker.misc.employeeId(),
  fullName: Faker.person.fullName(firstName, lastName),
  username: Faker.internet.username(firstName, lastName),
  password: Faker.misc.password(),
};
