# nameingConvention

## Function - camelToSnake

Convert camelCase string or object key names to snake_case

### Parameters

- `obj`: `any` - Object

- `isString`: `boolean` - Whether to process a single string (default false)

### Return Value

`any` - The converted object

### Examples
```typescript
import { camelToSnake } from '@lengineerc/utils';

// String conversion
console.log(camelToSnake('camelCase', true)); // 'camel_case'
console.log(camelToSnake('XMLHttpRequest', true)); // 'xml_http_request'
console.log(camelToSnake('getUserInfo', true)); // 'get_user_info'

// Object conversion
const obj = {
  userName: 'john',
  userAge: 25,
  userInfo: {
    firstName: 'John',
    lastName: 'Doe',
    contactInfo: {
      email: 'john@example.com',
      phoneNumber: '123-456-7890'
    }
  },
  hobbies: ['reading', 'swimming']
};

const converted = camelToSnake(obj);
console.log(converted);
// {
//   user_name: 'john',
//   user_age: 25,
//   user_info: {
//     first_name: 'John',
//     last_name: 'Doe',
//     contact_info: {
//       email: 'john@example.com',
//       phone_number: '123-456-7890'
//     }
//   },
//   hobbies: ['reading', 'swimming']
// }

// Array conversion
const arr = [
  { firstName: 'John', lastName: 'Doe' },
  { firstName: 'Jane', lastName: 'Smith' }
];

const convertedArr = camelToSnake(arr);
console.log(convertedArr);
// [
//   { first_name: 'John', last_name: 'Doe' },
//   { first_name: 'Jane', last_name: 'Smith' }
// ]
```
## Function - snakeToCamel

Convert snake_case string or object key names to camelCase

### Parameters

- `obj`: `any` - Object

- `isString`: `boolean` - Whether to process a single string (default false)

### Return Value

`any` - The converted object

### Examples

```typescript
import { snakeToCamel } from '@lengineerc/utils';

// String conversion
console.log(snakeToCamel('snake_case', true)); // 'snakeCase'
console.log(snakeToCamel('user_name', true)); // 'userName'
console.log(snakeToCamel('get_user_info', true)); // 'getUserInfo'

// Object conversion
const obj = {
  user_name: 'john',
  user_age: 25,
  user_info: {
    first_name: 'John',
    last_name: 'Doe',
    contact_info: {
      email: 'john@example.com',
      phone_number: '123-456-7890'
    }
  },
  hobbies: ['reading', 'swimming']
};

const converted = snakeToCamel(obj);
console.log(converted);
// {
//   userName: 'john',
//   userAge: 25,
//   userInfo: {
//     firstName: 'John',
//     lastName: 'Doe',
//     contactInfo: {
//       email: 'john@example.com',
//       phoneNumber: '123-456-7890'
//     }
//   },
//   hobbies: ['reading', 'swimming']
// }

// Array conversion
const arr = [
  { first_name: 'John', last_name: 'Doe' },
  { first_name: 'Jane', last_name: 'Smith' }
];

const convertedArr = snakeToCamel(arr);
console.log(convertedArr);
// [
//   { firstName: 'John', lastName: 'Doe' },
//   { firstName: 'Jane', lastName: 'Smith' }
// ]
```

## Conversion Rules

### CamelCase to snake_case

- `camelCase` → `camel_case`
- `XMLHttpRequest` → `xml_http_request`
- `getUserInfo` → `get_user_info`
- `HTTPResponse` → `http_response`

### snake_case to CamelCase

- `snake_case` → `snakeCase`
- `user_name` → `userName`
- `get_user_info` → `getUserInfo`
- `http_response` → `httpResponse`

