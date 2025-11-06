import path from 'path';
import process from 'process';
import fs from 'fs';

const args = process.argv.slice(2);

const SRC_DIR_PATH = path.join(process.cwd(), 'src');
const TEST_DIR_PATH = path.join(process.cwd(), '__test__');

async function checkFileExists(filePath: string, filename: string): Promise<boolean> {
  if (!fs.existsSync(filePath)) {
    return true;
  }

  if (process.stdout.isTTY) {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(`文件 ${filename} 已存在，是否覆盖？(y/N): `, (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
  } else {
    console.warn(`警告: 文件 ${filename} 已存在，跳过创建`);
    return false;
  }
}

async function safeWriteFile(filePath: string, content: string = '', filename: string): Promise<boolean> {
  const canWrite = await checkFileExists(filePath, filename);
  if (!canWrite) {
    return false;
  }

  fs.writeFileSync(filePath, content);
  return true;
}

function safeAppendToFile(filePath: string, content: string, filename: string): boolean {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    return true;
  }

  const existingContent = fs.readFileSync(filePath, 'utf8');
  const exportStatement = `export * from './${filename}';`;
  
  if (existingContent.includes(exportStatement)) {
    console.warn(`警告: 导出语句已存在于 ${filePath}，跳过追加`);
    return false;
  }

  const prefix = existingContent.endsWith('\n') || existingContent.length === 0 ? '' : '\n';
  fs.appendFileSync(filePath, prefix + exportStatement);
  return true;
}

function validatePath(pathArr: string[]): boolean {
  if (pathArr.length === 0 || pathArr.some(p => p.length === 0)) {
    throw new Error('路径错误: 路径不能为空');
  }

  if (pathArr.some(part => part === '..' || part === '.')) {
    throw new Error('路径错误: 不允许使用相对路径');
  }

  const filename = pathArr[pathArr.length - 1];
  if (!/^[a-zA-Z0-9_-]+$/.test(filename)) {
    throw new Error(`文件名错误: "${filename}" 只能包含字母、数字、下划线和连字符`);
  }

  return true;
}

function createDirectory(dirPath: string): boolean {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`创建目录: ${dirPath}`);
    return true;
  }
  return false;
}

async function main() {
  if (args.length === 0) {
    console.log('参数为空');
    return;
  }

  for (const value of args) {
    try {
      const pathArr = value.split('/').filter(Boolean);
      validatePath(pathArr);

      const filename = pathArr.pop()!;
      const dirs = pathArr;

      console.log(`\n处理模块: ${value}`);

      const srcDirPath = path.resolve(SRC_DIR_PATH, ...dirs);
      const srcFilePath = path.resolve(srcDirPath, `${filename}.ts`);
      const dirIndexPath = path.resolve(srcDirPath, 'index.ts');

      createDirectory(srcDirPath);

      const srcFileCreated = await safeWriteFile(srcFilePath, '', `${filename}.ts`);
      if (!srcFileCreated) {
        continue;
      }

      if (!fs.existsSync(dirIndexPath)) {
        fs.writeFileSync(dirIndexPath, '');
      }

      safeAppendToFile(dirIndexPath, `export * from './${filename}';`, filename);

      if (dirs.length > 0) {
        const rootIndexPath = path.resolve(SRC_DIR_PATH, 'index.ts');
        if (!fs.existsSync(rootIndexPath)) {
          fs.writeFileSync(rootIndexPath, '');
        }
        
        const relativePath = `./${dirs.join('/')}`;
        const rootExport = `export * from '${relativePath}';`;
        
        const rootIndexContent = fs.readFileSync(rootIndexPath, 'utf8');
        if (!rootIndexContent.includes(rootExport)) {
          const prefix = rootIndexContent.endsWith('\n') || rootIndexContent.length === 0 ? '' : '\n';
          fs.appendFileSync(rootIndexPath, prefix + rootExport);
        }
      }

      const testDirPath = path.resolve(TEST_DIR_PATH, ...dirs);
      const testFilePath = path.resolve(testDirPath, `${filename}.test.ts`);

      createDirectory(testDirPath);

      const testFileCreated = await safeWriteFile(
        testFilePath, 
        `import { ${filename} } from '../../src/${dirs.length > 0 ? dirs.join('/') + '/' : ''}${filename}';`,
        `${filename}.test.ts`
      );

      if (srcFileCreated || testFileCreated) {
        console.log(`✓ 成功创建 ${filename} 相关文件`);
      }

    } catch (error: any) {
      console.error(`❌ 处理 ${value} 时出错:`, error.message);
    }
  }

  console.log('\n✅ 处理完成');
}

main().catch(console.error);