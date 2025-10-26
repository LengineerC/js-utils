# nameingConvention

命名约定转换工具，支持驼峰命名和下划线命名之间的转换。

## 函数

### camelToSnake

将驼峰命名转换为下划线命名。

#### 语法

```typescript
camelToSnake(obj: any, isString: boolean = false): any
```

#### 参数

- `obj` - 需要转换的对象或字符串
- `isString` - 是否处理单个字符串，默认 false

#### 返回值

返回转换后的对象或字符串。

#### 示例

```typescript
import { camelToSnake } from '@lengineerc/utils';

// 字符串转换
console.log(camelToSnake('camelCase', true)); // 'camel_case'
console.log(camelToSnake('XMLHttpRequest', true)); // 'xml_http_request'
console.log(camelToSnake('getUserInfo', true)); // 'get_user_info'

// 对象转换
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

// 数组转换
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

### snakeToCamel

将下划线命名转换为驼峰命名。

#### 语法

```typescript
snakeToCamel(obj: any, isString: boolean = false): any
```

#### 参数

- `obj` - 需要转换的对象或字符串
- `isString` - 是否处理单个字符串，默认 false

#### 返回值

返回转换后的对象或字符串。

#### 示例

```typescript
import { snakeToCamel } from '@lengineerc/utils';

// 字符串转换
console.log(snakeToCamel('snake_case', true)); // 'snakeCase'
console.log(snakeToCamel('user_name', true)); // 'userName'
console.log(snakeToCamel('get_user_info', true)); // 'getUserInfo'

// 对象转换
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

// 数组转换
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

## 转换规则

### 驼峰转下划线

- `camelCase` → `camel_case`
- `XMLHttpRequest` → `xml_http_request`
- `getUserInfo` → `get_user_info`
- `HTTPResponse` → `http_response`

### 下划线转驼峰

- `snake_case` → `snakeCase`
- `user_name` → `userName`
- `get_user_info` → `getUserInfo`
- `http_response` → `httpResponse`

## 特性

- 支持嵌套对象转换
- 支持数组转换
- 支持字符串单独转换
- 保持非对象值不变
- 递归处理所有层级
- 处理各种边界情况
