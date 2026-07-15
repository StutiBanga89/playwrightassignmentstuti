type RandomFunction = () => string;

const randomElement = (items: string[]): string => items[Math.floor(Math.random() * items.length)];

export class Faker {
  static readonly person = {
    firstName: (): string => randomElement([
      'Avery', 'Blake', 'Casey', 'Drew', 'Emery', 'Finley', 'Harper', 'Jordan', 'Logan', 'Morgan',
      'Parker', 'Quinn', 'Reese', 'Rowan', 'Taylor',
    ]),

    middleName: (): string => randomElement([
      'Lee', 'James', 'Alex', 'Ray', 'Blake', 'Kai', 'Noel', 'Jay', 'Sky', 'Jude',
    ]),

    lastName: (): string => randomElement([
      'Adams', 'Bennett', 'Carter', 'Diaz', 'Edwards', 'Fisher', 'Griffin', 'Hayes', 'Jenkins', 'Kelly',
      'Morgan', 'Patterson', 'Reed', 'Sullivan', 'Wright',
    ]),

    fullName: (firstName?: string, lastName?: string): string => {
      const first = firstName ?? Faker.person.firstName();
      const last = lastName ?? Faker.person.lastName();
      return `${first} ${last}`;
    },
  };

  static readonly internet = {
    email: (): string => {
      const timestamp = Date.now();
      const suffix = Math.floor(Math.random() * 10000);
      return `test.${timestamp}.${suffix}@example.com`;
    },

    username: (firstName: string, lastName: string): string => {
      const suffix = Math.floor(Math.random() * 10000);
      return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}`;
    },
  };

  static readonly phone = {
    number: (): string => {
      const digits = Math.floor(Math.random() * 9000000000) + 1000000000;
      return digits.toString();
    },
  };

  static readonly misc = {
    password: (): string => {
      const suffix = Math.floor(Math.random() * 10000);
      return `Pass${suffix}!`;
    },

    employeeId: (): string => {
      return `${Math.floor(Math.random() * 900000) + 100000}`;
    },
  };
}
