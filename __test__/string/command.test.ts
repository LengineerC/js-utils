import { CommandBuilder } from '../../src';

describe('CommandBuilder', () => {
  let builder: CommandBuilder;

  beforeEach(() => {
    builder = new CommandBuilder();
  });

  describe('基本功能', () => {
    test('应该创建空的 CommandBuilder 实例', () => {
      expect(builder).toBeInstanceOf(CommandBuilder);
      expect(builder.toString()).toBe('');
    });

    test('应该支持链式调用', () => {
      const result = builder
        .command('git')
        .arg('commit')
        .flag('-m')
        .arg('Initial commit')
        .option('--author', 'John Doe');

      expect(result).toBe(builder);
    });
  });

  describe('command 方法', () => {
    test('应该添加命令', () => {
      builder.command('git');
      expect(builder.toString()).toBe('git');
    });

    test('应该支持多个命令', () => {
      builder.command('git').command('add');
      expect(builder.toString()).toBe('git add');
    });
  });

  describe('arg 方法', () => {
    test('应该添加字符串参数', () => {
      builder.command('echo').arg('hello world');
      expect(builder.toString()).toBe('echo "hello world"');
    });

    test('应该添加数字参数', () => {
      builder.command('sleep').arg(5);
      expect(builder.toString()).toBe('sleep 5');
    });

    test('应该转义包含空格的参数', () => {
      builder.command('echo').arg('hello world');
      expect(builder.toString()).toBe('echo "hello world"');
    });

    test('应该转义包含引号的参数', () => {
      builder.command('echo').arg('say "hello"');
      expect(builder.toString()).toBe('echo "say \\"hello\\""');
    });

    test('应该转义包含反斜杠的参数', () => {
      builder.command('echo').arg('path\\to\\file');
      expect(builder.toString()).toBe('echo "path\\\\to\\\\file"');
    });

    test('应该转义包含单引号的参数', () => {
      builder.command('echo').arg("don't");
      expect(builder.toString()).toBe('echo "don\'t"');
    });

    test('应该转义包含多种特殊字符的参数', () => {
      builder.command('echo').arg('path with "quotes" and\\backslashes');
      expect(builder.toString()).toBe('echo "path with \\"quotes\\" and\\\\backslashes"');
    });

    test('不应该转义不包含特殊字符的参数', () => {
      builder.command('echo').arg('hello');
      expect(builder.toString()).toBe('echo hello');
    });
  });

  describe('flag 方法', () => {
    test('应该添加简单的标志', () => {
      builder.command('ls').flag('-l');
      expect(builder.toString()).toBe('ls -l');
    });

    test('应该添加带值的标志', () => {
      builder.command('grep').flag('-n', 10);
      expect(builder.toString()).toBe('grep -n 10');
    });

    test('应该添加带字符串值的标志', () => {
      builder.command('grep').flag('-f', 'pattern.txt');
      expect(builder.toString()).toBe('grep -f pattern.txt');
    });

    test('应该添加布尔值为 true 的标志', () => {
      builder.command('ls').flag('-a', true);
      expect(builder.toString()).toBe('ls -a');
    });

    test('应该忽略布尔值为 false 的标志', () => {
      builder.command('ls').flag('-a', false);
      expect(builder.toString()).toBe('ls');
    });

    test('应该忽略 undefined 值的标志', () => {
      builder.command('ls').flag('-a', undefined);
      expect(builder.toString()).toBe('ls -a');
    });

    test('应该转义标志值中的特殊字符', () => {
      builder.command('grep').flag('-f', 'file with spaces.txt');
      expect(builder.toString()).toBe('grep -f "file with spaces.txt"');
    });

    test('应该支持多个标志', () => {
      builder.command('ls').flag('-l').flag('-a').flag('-h');
      expect(builder.toString()).toBe('ls -l -a -h');
    });
  });

  describe('option 方法', () => {
    test('应该添加布尔值为 true 的选项', () => {
      builder.command('git').option('--verbose', true);
      expect(builder.toString()).toBe('git --verbose');
    });

    test('应该添加带值的选项', () => {
      builder.command('git').option('--author', 'John Doe');
      expect(builder.toString()).toBe('git --author="John Doe"');
    });

    test('应该添加数字值的选项', () => {
      builder.command('git').option('--max-count', 10);
      expect(builder.toString()).toBe('git --max-count=10');
    });

    test('应该忽略布尔值为 false 的选项', () => {
      builder.command('git').option('--verbose', false);
      expect(builder.toString()).toBe('git');
    });

    test('应该忽略 undefined 值的选项', () => {
      builder.command('git').option('--verbose', undefined);
      expect(builder.toString()).toBe('git');
    });

    test('应该转义选项值中的特殊字符', () => {
      builder.command('git').option('--message', 'commit with "quotes"');
      expect(builder.toString()).toBe('git --message="commit with \\"quotes\\""');
    });

    test('应该支持多个选项', () => {
      builder.command('git')
        .option('--verbose', true)
        .option('--author', 'John Doe')
        .option('--max-count', 10);
      expect(builder.toString()).toBe('git --verbose --author="John Doe" --max-count=10');
    });
  });

  describe('toString 方法', () => {
    test('应该返回完整的命令字符串', () => {
      builder.command('git')
        .arg('commit')
        .flag('-m')
        .arg('Initial commit')
        .option('--author', 'John Doe');
      
      expect(builder.toString()).toBe('git commit -m "Initial commit" --author="John Doe"');
    });

    test('应该处理空命令', () => {
      expect(builder.toString()).toBe('');
    });

    test('应该正确处理复杂的命令', () => {
      builder.command('docker')
        .arg('run')
        .flag('-d')
        .flag('-p', '8080:80')
        .option('--name', 'my-container')
        .arg('nginx');
      
      expect(builder.toString()).toBe('docker run -d -p 8080:80 --name=my-container nginx');
    });
  });

  describe('build 方法', () => {
    test('应该返回命令和参数对象', () => {
      builder.command('git')
        .arg('commit')
        .flag('-m')
        .arg('Initial commit')
        .option('--author', 'John Doe');

      const result = builder.build();
      
      expect(result).toEqual({
        command: 'git',
        args: ['commit', '-m', '"Initial commit"', '--author="John Doe"']
      });
    });

    test('应该过滤空字符串参数', () => {
      builder.command('git').arg('').arg('commit').arg('');

      const result = builder.build();
      
      expect(result).toEqual({
        command: 'git',
        args: ['commit']
      });
    });

    test('应该抛出空命令错误', () => {
      expect(() => builder.build()).toThrow('Command is empty');
    });

    test('应该正确处理只有命令的情况', () => {
      builder.command('ls');
      
      const result = builder.build();
      
      expect(result).toEqual({
        command: 'ls',
        args: []
      });
    });

    test('应该正确处理复杂命令', () => {
      builder.command('docker')
        .arg('run')
        .flag('-d')
        .flag('-p', '8080:80')
        .option('--name', 'my-container')
        .arg('nginx')
        .arg('--version');

      const result = builder.build();
      
      expect(result).toEqual({
        command: 'docker',
        args: ['run', '-d', '-p', '8080:80', '--name=my-container', 'nginx', '--version']
      });
    });
  });

  describe('转义功能测试', () => {
    test('应该正确转义各种特殊字符组合', () => {
      const testCases = [
        { input: 'simple', expected: 'simple' },
        { input: 'with spaces', expected: '"with spaces"' },
        { input: 'with"quotes"', expected: '"with\\"quotes\\""' },
        { input: 'with\\backslashes', expected: '"with\\\\backslashes"' },
        { input: 'with\'single\'quotes', expected: '"with\'single\'quotes"' },
        { input: 'with "mixed" and\\backslashes', expected: '"with \\"mixed\\" and\\\\backslashes"' },
        { input: 'with\nnewlines', expected: '"with\nnewlines"' },
        { input: 'with\ttabs', expected: '"with\ttabs"' }
      ];

      testCases.forEach(({ input, expected }) => {
        const builder = new CommandBuilder();
        builder.command('echo').arg(input);
        expect(builder.toString()).toBe(`echo ${expected}`);
      });
    });
  });

  describe('实际使用场景测试', () => {
    test('Git 命令示例', () => {
      const gitCommand = new CommandBuilder()
        .command('git')
        .arg('commit')
        .flag('-m')
        .arg('Add new feature')
        .option('--author', 'John Doe <john@example.com>')
        .option('--date', '2023-01-01');

      expect(gitCommand.toString()).toBe('git commit -m "Add new feature" --author="John Doe <john@example.com>" --date=2023-01-01');
      
      const result = gitCommand.build();
      expect(result).toEqual({
        command: 'git',
        args: ['commit', '-m', '"Add new feature"', '--author="John Doe <john@example.com>"', '--date=2023-01-01']
      });
    });

    test('Docker 命令示例', () => {
      const dockerCommand = new CommandBuilder()
        .command('docker')
        .arg('run')
        .flag('-d')
        .flag('-p', '3000:3000')
        .flag('-e', 'NODE_ENV=production')
        .option('--name', 'my-app')
        .option('--restart', 'unless-stopped')
        .arg('node:18')
        .arg('npm')
        .arg('start');

      expect(dockerCommand.toString()).toBe('docker run -d -p 3000:3000 -e NODE_ENV=production --name=my-app --restart=unless-stopped node:18 npm start');
    });

    test('NPM 命令示例', () => {
      const npmCommand = new CommandBuilder()
        .command('npm')
        .arg('install')
        .arg('express')
        .flag('--save')
        .flag('--verbose')
        .option('--registry', 'https://registry.npmjs.org/');

      expect(npmCommand.toString()).toBe('npm install express --save --verbose --registry=https://registry.npmjs.org/');
    });

    test('复杂脚本命令示例', () => {
      const scriptCommand = new CommandBuilder()
        .command('bash')
        .arg('-c')
        .arg('echo "Hello World" && ls -la /tmp');

      expect(scriptCommand.toString()).toBe('bash -c "echo \\"Hello World\\" && ls -la /tmp"');
    });
  });

  describe('边界情况测试', () => {
    test('应该处理空字符串参数', () => {
      builder.command('echo').arg('');
      expect(builder.toString()).toBe('echo ');
    });

    test('应该处理数字 0', () => {
      builder.command('sleep').arg(0);
      expect(builder.toString()).toBe('sleep 0');
    });

    test('应该处理布尔值 false 在 flag 中', () => {
      builder.command('ls').flag('-a', false);
      expect(builder.toString()).toBe('ls');
    });

    test('应该处理布尔值 false 在 option 中', () => {
      builder.command('git').option('--verbose', false);
      expect(builder.toString()).toBe('git');
    });

    test('应该处理 undefined 值', () => {
      builder.command('ls').flag('-a', undefined);
      expect(builder.toString()).toBe('ls -a');
    });

    test('应该处理只包含空格的参数', () => {
      builder.command('echo').arg('   ');
      expect(builder.toString()).toBe('echo "   "');
    });

    test('应该处理只包含特殊字符的参数', () => {
      builder.command('echo').arg('"\\');
      expect(builder.toString()).toBe('echo "\\"\\\\"');
    });
  });

  describe('链式调用测试', () => {
    test('应该支持长链式调用', () => {
      const result = builder
        .command('git')
        .arg('add')
        .arg('.')
        .command('git')
        .arg('commit')
        .flag('-m')
        .arg('Update files')
        .option('--author', 'Developer')
        .command('git')
        .arg('push')
        .flag('--force')
        .option('--set-upstream', 'origin main');

      expect(result).toBe(builder);
      expect(builder.toString()).toBe('git add . git commit -m "Update files" --author=Developer git push --force --set-upstream="origin main"');
    });

    test('应该支持条件性添加参数', () => {
      const addVerbose = true;
      const addDebug = false;
      const author = 'John Doe';

      builder.command('npm')
        .arg('run')
        .arg('build');

      if (addVerbose) {
        builder.flag('--verbose');
      }

      if (addDebug) {
        builder.flag('--debug');
      }

      if (author) {
        builder.option('--author', author);
      }

      expect(builder.toString()).toBe('npm run build --verbose --author="John Doe"');
    });
  });

  describe('错误处理测试', () => {
    test('应该在空命令时抛出错误', () => {
      expect(() => builder.build()).toThrow('Command is empty');
    });

    test('应该在有命令但无参数时正常工作', () => {
      builder.command('ls');
      const result = builder.build();
      expect(result).toEqual({ command: 'ls', args: [] });
    });
  });
});
