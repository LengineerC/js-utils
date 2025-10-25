const { camelToSnake, snakeToCamel } = require('../dist');

describe("命名转换", () => {
  test('camelToSnake 应该正确转换', () => {
    const data = {
      userName: "John Doe",
      userAge: 30,
      contactInfo: {
        phoneNumber: "123-456-7890",
        emailAddress: "john@example.com"
      },
      UPPERAttr: 'test',
      hobbies: ["readingBooks", "playingGames"]
    };

    const result = camelToSnake(data);

    expect(result.user_name).toBe("John Doe");
    expect(result.user_age).toBe(30);
    expect(result.upper_attr).toBe('test');
    expect(result.contact_info.phone_number).toBe("123-456-7890");
    expect(result.contact_info.email_address).toBe("john@example.com");
    expect(data.userName).toBe("John Doe");
    expect(data.contactInfo.phoneNumber).toBe("123-456-7890");
    expect(result.userName).toBeUndefined();
    expect(result.contactInfo).toBeUndefined();
    expect(result).toEqual({
      user_name: "John Doe",
      user_age: 30,
      contact_info: {
        phone_number: "123-456-7890",
        email_address: "john@example.com"
      },
      upper_attr: 'test',
      hobbies: ["readingBooks", "playingGames"]
    });

    expect(camelToSnake({})).toEqual({});
    expect(camelToSnake(null)).toBe(null);

    expect(camelToSnake("readingBooks")).toBe("readingBooks");
    expect(camelToSnake("readingBooks", true)).toBe("reading_books");

    expect(camelToSnake('UPPERStringTest')).toBe('UPPERStringTest');
    expect(camelToSnake('UPPERStringTest', true)).toBe('upper_string_test');
  });

  test('snakeToCamel 应该正确转换', () => {
    const data = {
      user_name: "John Doe",
      user_age: 30,
      contact_info: {
        phone_number: "123-456-7890",
        email_address: "john@example.com"
      },
      hobbies: ["readingBooks", "playingGames"]
    }

    const result = snakeToCamel(data);

    expect(result.userName).toBe("John Doe");
    expect(result.userAge).toBe(30);
    expect(result.contactInfo.phoneNumber).toBe("123-456-7890");
    expect(result.contactInfo.emailAddress).toBe("john@example.com");
    expect(data.user_name).toBe("John Doe");
    expect(data.contact_info.phone_number).toBe("123-456-7890");
    expect(result.user_name).toBeUndefined();
    expect(result.contact_info).toBeUndefined();
    expect(result).toEqual({
      userName: "John Doe",
      userAge: 30,
      contactInfo: {
        phoneNumber: "123-456-7890",
        emailAddress: "john@example.com"
      },
      hobbies: ["readingBooks", "playingGames"]
    });

    expect(snakeToCamel({})).toEqual({});
    expect(snakeToCamel(null)).toBe(null);

    expect(snakeToCamel("reading_books")).toBe("reading_books");
    expect(snakeToCamel("reading_books", true)).toBe("readingBooks");

    expect(snakeToCamel('upper_string_test')).toBe('upper_string_test');
    expect(snakeToCamel('upper_string_test', true)).toBe('upperStringTest');
  });
});