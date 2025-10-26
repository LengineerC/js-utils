# command

命令构建器，用于安全地构建命令行命令。

## 类

### CommandBuilder

命令构建器类，提供链式 API 来构建命令行命令。

#### 构造函数

```typescript
new CommandBuilder()
```

#### 方法

##### command

添加命令主体。

```typescript
command(cmd: string): CommandBuilder
```

**参数：**
- `cmd` - 命令主体

**返回值：** 返回当前实例，支持链式调用

##### arg

添加参数。

```typescript
arg(value: string | number): CommandBuilder
```

**参数：**
- `value` - 参数值

**返回值：** 返回当前实例，支持链式调用

##### flag

添加标志。

```typescript
flag(flag: string, value?: string | number | boolean): CommandBuilder
```

**参数：**
- `flag` - 标志名
- `value` - 标志值（可选）

**返回值：** 返回当前实例，支持链式调用

##### option

添加选项。

```typescript
option(key: string, value?: string | number | boolean): CommandBuilder
```

**参数：**
- `key` - 选项键
- `value` - 选项值（可选）

**返回值：** 返回当前实例，支持链式调用

##### toString

将命令构建为字符串。

```typescript
toString(): string
```

**返回值：** 构建后的命令字符串

##### build

构建命令对象。

```typescript
build(): { command: string; args: string[] }
```

**返回值：** 包含命令和参数的对象

#### 示例

```typescript
import { CommandBuilder } from '@lengineerc/utils';

// 基本用法
const cmd1 = new CommandBuilder()
  .command('git')
  .arg('commit')
  .flag('-m')
  .arg('Initial commit')
  .option('--author', 'John Doe');

console.log(cmd1.toString());
// git commit -m "Initial commit" --author="John Doe"

// Docker 命令
const cmd2 = new CommandBuilder()
  .command('docker')
  .arg('run')
  .flag('-d')
  .flag('-p', '8080:80')
  .option('--name', 'my-container')
  .arg('nginx');

console.log(cmd2.toString());
// docker run -d -p 8080:80 --name=my-container nginx

// 复杂命令
const cmd3 = new CommandBuilder()
  .command('npm')
  .arg('install')
  .arg('express')
  .flag('--save')
  .flag('--verbose')
  .option('--registry', 'https://registry.npmjs.org/');

console.log(cmd3.toString());
// npm install express --save --verbose --registry=https://registry.npmjs.org/

// 获取命令对象
const result = cmd1.build();
console.log(result);
// { command: 'git', args: ['commit', '-m', 'Initial commit', '--author="John Doe"'] }
```

#### 参数转义

CommandBuilder 会自动转义包含特殊字符的参数：

```typescript
const cmd = new CommandBuilder()
  .command('echo')
  .arg('hello world')  // 包含空格
  .arg('say "hello"')  // 包含引号
  .arg('path\\to\\file'); // 包含反斜杠

console.log(cmd.toString());
// echo "hello world" "say \"hello\"" "path\\to\\file"
```

#### 条件性添加参数

```typescript
const addVerbose = true;
const addDebug = false;
const author = 'John Doe';

const cmd = new CommandBuilder()
  .command('npm')
  .arg('run')
  .arg('build');

if (addVerbose) {
  cmd.flag('--verbose');
}

if (addDebug) {
  cmd.flag('--debug');
}

if (author) {
  cmd.option('--author', author);
}

console.log(cmd.toString());
// npm run build --verbose --author="John Doe"
```

## 特性

- 链式 API 设计
- 自动参数转义
- 支持各种参数类型
- 类型安全
- 错误处理
- 支持条件性参数添加
