# command

Command builder for safely building command-line commands.

## Classes

### CommandBuilder

Command builder class providing a chainable API to build command-line commands.

#### Constructor

```typescript
new CommandBuilder()
```

#### Member Methods

##### command

Add command body.

```typescript
command(cmd: string): CommandBuilder
```

**Parameters:**
- `cmd` - Command body

**Return Value:** Returns current instance, supports chaining

##### arg

Add an argument.

```typescript
arg(value: string | number): CommandBuilder
```

**Parameters:**
- `value` - Argument value

**Return Value:** Returns current instance, supports chaining

##### flag

Add a flag.

```typescript
flag(flag: string, value?: string | number | boolean): CommandBuilder
```

**Parameters:**
- `flag` - Flag name
- `value` - Flag value (optional)

**Return Value:** Returns current instance, supports chaining

##### option

Add an option.

```typescript
option(key: string, value?: string | number | boolean): CommandBuilder
```

**Parameters:**
- `key` - Option key
- `value` - Option value (optional)

**Return Value:** Returns current instance, supports chaining

##### toString

Build the command as a string.

```typescript
toString(): string
```

**Return Value:** The built command string

##### build

Build command object.

```typescript
build(): { command: string; args: string[] }
```

**Return Value:** Object containing command and arguments

#### Examples

```typescript
import { CommandBuilder } from '@lengineerc/utils';

// Basic usage
const cmd1 = new CommandBuilder()
  .command('git')
  .arg('commit')
  .flag('-m')
  .arg('Initial commit')
  .option('--author', 'John Doe');

console.log(cmd1.toString());
// git commit -m "Initial commit" --author="John Doe"

// Docker command
const cmd2 = new CommandBuilder()
  .command('docker')
  .arg('run')
  .flag('-d')
  .flag('-p', '8080:80')
  .option('--name', 'my-container')
  .arg('nginx');

console.log(cmd2.toString());
// docker run -d -p 8080:80 --name=my-container nginx

// Complex command
const cmd3 = new CommandBuilder()
  .command('npm')
  .arg('install')
  .arg('express')
  .flag('--save')
  .flag('--verbose')
  .option('--registry', 'https://registry.npmjs.org/');

console.log(cmd3.toString());
// npm install express --save --verbose --registry=https://registry.npmjs.org/

// Get command object
const result = cmd1.build();
console.log(result);
// { command: 'git', args: ['commit', '-m', 'Initial commit', '--author="John Doe"'] }
```

#### Argument Escaping

CommandBuilder automatically escapes arguments containing special characters:

```typescript
const cmd = new CommandBuilder()
  .command('echo')
  .arg('hello world')  // Contains space
  .arg('say "hello"')  // Contains quotes
  .arg('path\\to\\file'); // Contains backslashes

console.log(cmd.toString());
// echo "hello world" "say \"hello\"" "path\\to\\file"
```

#### Conditionally Adding Arguments

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

## Features

- Chainable API design
- Automatic argument escaping
- Supports various argument types
- Type safe
- Error handling
- Supports conditional argument addition

