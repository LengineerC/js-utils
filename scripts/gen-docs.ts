import path from 'path';
import process from 'process';
import fs from 'fs';

const docsDir = path.resolve(process.cwd(), 'docs', 'zh-cn');
const distDir = path.resolve(process.cwd(), 'dist/types');

export interface JSDocTag {
  tag: string;
  name?: string;
  type?: string;
  description?: string;
}

export interface JSDocComment {
  description: string;
  tags: JSDocTag[];
  codeContext?: string;
}

enum RESOURCE_TYPE {
  File,
  Directory,
}
interface Resource {
  path: string,
  type: RESOURCE_TYPE,
  children?: Resource[];
}
function createFileTree(dirPath: string, depth: number = 0): Resource[] {
  const nodes: Resource[] = [];
  const basePath = depth > 0 ? path.basename(dirPath) : '';
  const paths = fs.readdirSync(dirPath);

  for (const p of paths) {
    const fullPath = path.resolve(dirPath, p);
    const relativePath = path.join(basePath, p);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const children = createFileTree(fullPath, depth + 1);
      const dir = {
        path: relativePath,
        type: RESOURCE_TYPE.Directory,
        children,
      };

      nodes.push(dir);
    } else if (stat.isFile()) {
      if (/\.d\.ts$/.test(relativePath)) {
        const file: Resource = {
          path: relativePath,
          type: RESOURCE_TYPE.File,
        };

        nodes.push(file);
      }
    }
  }

  return nodes;
}

export interface DocEntry {
  kind: 'function' | 'method' | 'class';
  name: string;
  description: string;
  tags: {
    tag: string;
    name?: string;
    type?: string;
    description?: string;
  }[];
  className?: string;
}


export function parseDtsDocs(source: string): DocEntry[] {
  const results: DocEntry[] = [];

  const funcRegex =
    /\/\*\*([\s\S]*?)\*\/\s*(?:export\s+)?(?:declare\s+)?function\s+([A-Za-z_$][\w$]*)/g;

  const classHeaderRegex =
    /\/\*\*([\s\S]*?)\*\/\s*(?:export\s+)?(?:declare\s+)?class\s+([A-Za-z_$][\w$]*)/g;

  let match: RegExpExecArray | null;

  while ((match = funcRegex.exec(source))) {
    const [, jsdoc, name] = match;
    results.push({
      kind: 'function',
      name,
      description: extractDescription(jsdoc),
      tags: extractTags(jsdoc),
    });
  }

  while ((match = classHeaderRegex.exec(source))) {
    const [, classDoc, className] = match;
    const startIndex = source.indexOf('{', match.index);
    if (startIndex === -1) continue;

    let braceCount = 1;
    let i = startIndex + 1;
    for (; i < source.length; i++) {
      const char = source[i];
      if (char === '{') braceCount++;
      else if (char === '}') braceCount--;
      if (braceCount === 0) break;
    }

    const classBody = source.slice(startIndex + 1, i);

    results.push({
      kind: 'class',
      name: className,
      description: extractDescription(classDoc),
      tags: extractTags(classDoc),
    });

    const methodRegex = /\/\*\*([\s\S]*?)\*\/\s*([A-Za-z_$][\w$]*)\s*\(/g;
    let m: RegExpExecArray | null;
    while ((m = methodRegex.exec(classBody))) {
      const [, jsdoc, methodName] = m;
      results.push({
        kind: 'method',
        name: methodName,
        className,
        description: extractDescription(jsdoc),
        tags: extractTags(jsdoc),
      });
    }
  }

  return results;
}


function extractDescription(jsdoc: string): string {
  return jsdoc
    .split('\n')
    .map(line => line.replace(/^\s*\*\s?/, '').trim())
    .filter(line => line && !line.startsWith('@'))
    .join(' ');
}

function extractTags(jsdoc: string) {
  const tags: {
    tag: string;
    name?: string;
    type?: string;
    description?: string;
  }[] = [];

  const lines = jsdoc
    .split('\n')
    .map(line => line.replace(/^\s*\*\s?/, '').trim())
    .filter(Boolean);

  for (const line of lines) {
    if (!line.startsWith('@')) continue;

    const parts = line.split(/\s+/);
    const tag = parts[0].slice(1);

    let type: string | undefined;
    let name: string | undefined;
    let description: string | undefined;

    let rest = line.slice(tag.length + 1).trim();

    if (rest.startsWith('{')) {
      let braceCount = 0;
      let i = 0;
      for (; i < rest.length; i++) {
        if (rest[i] === '{') braceCount++;
        else if (rest[i] === '}') braceCount--;
        if (braceCount === 0) break;
      }
      type = rest.slice(1, i).trim();
      rest = rest.slice(i + 1).trim();
    }

    const firstSpace = rest.indexOf(' ');
    if (firstSpace === -1) {
      name = rest || undefined;
      description = undefined;
    } else {
      name = rest.slice(0, firstSpace).trim() || undefined;
      description = rest.slice(firstSpace + 1).trim() || undefined;
    }

    tags.push({ tag, type, name, description });
  }

  return tags;
}

const fileTree = createFileTree(distDir);
// console.log(JSON.stringify(fileTree, null, 2));

function genDocs(tree: Resource[]) {
  for (const node of tree) {
    const mapPath = path.resolve(docsDir, node.path).replace(/\.d\.ts$/, '.md');

    if (!fs.existsSync(mapPath)) {
      if (node.type === RESOURCE_TYPE.File) {
        if (!/index\.d\.ts$/.test(node.path)) {
          let md = `# ${path.parse(mapPath).name}\n\n`;

          const srcPath = path.resolve(distDir, node.path);
          const content = fs.readFileSync(srcPath).toString();
          const docs = parseDtsDocs(content);
          // console.log(JSON.stringify(docs, null, 2));

          docs.forEach(item => {
            if (item.kind === 'class') {
              md += `## 类 - ${item.name}\n\n`;
              md += `${item.description.replace(/(\r\n)+/g, '\n')}\n\n`;
            }
            else if (item.kind === 'method') {
              let title = item.name === 'constructor' ? "构造器" : `成员方法 - ${item.name}`;
              md += `### ${title}\n\n`;
              md += `${item.description}\n\n`;
              md += `#### 参数\n\n`;
            }
            else if (item.kind === 'function') {
              md += `## 函数 - ${item.name}\n\n`;
              md += `${item.description}\n\n`;
              md += `### 参数\n\n`;
            }

            item.tags
              .filter(tag => tag.tag === 'param')
              .forEach(param => {
                const { name, type, description = '' } = param;
                md += `- \`${name}\`${type ? `: \`${type}\`` : ''} - ${description}\n\n`;
              });

            const returns = item.tags.filter(tag => tag.tag === 'returns');
            if (returns.length > 0) {
              md += `###${item.kind === 'method' ? '#' : ''} 返回值\n\n`;
              returns.forEach(item => {
                const { name = '', type } = item;
                md += `${type ? `\`${type}\` - ` : ''}${name}\n\n`;
              });
            }

            if (item.kind === 'function') md += `### 示例\n\n`;
          });

          fs.writeFileSync(mapPath, md, 'utf-8');
          console.log(`Created file ${mapPath}`);
        }
      } else if (node.type === RESOURCE_TYPE.Directory) {
        fs.mkdirSync(mapPath);

        const indexPath = path.resolve(mapPath, 'index.md');
        fs.writeFileSync(indexPath, '');
        console.log(`Created ${mapPath} and index.md`);

        genDocs(node.children!);
      }
    } else {
      if (node.type === RESOURCE_TYPE.Directory) {
        genDocs(node.children!);
      } else if (node.type === RESOURCE_TYPE.File) {
        if (!/index\.d\.ts$/.test(node.path)) {
          const srcPath = path.resolve(distDir, node.path);
          const content = fs.readFileSync(srcPath).toString();
          const docs = parseDtsDocs(content);

          let appendixMd = '';
          docs.forEach(item => {
            if (!content.includes(item.name)) {
              if (item.kind === 'class') {
                appendixMd += `\n\n## 类 - ${item.name}\n\n`;
                appendixMd += `${item.description.replace(/(\r\n)+/g, '\n')}\n\n`;
              }
              else if (item.kind === 'method') {
                let title = item.name === 'constructor' ? "构造器" : `成员方法 - ${item.name}`;
                appendixMd += `### ${title}\n\n`;
                appendixMd += `${item.description}\n\n`;
                appendixMd += `#### 参数\n\n`;
              }
              else if (item.kind === 'function') {
                appendixMd += `\n\n## 函数 - ${item.name}\n\n`;
                appendixMd += `${item.description}\n\n`;
                appendixMd += `### 参数\n\n`;
              }

              item.tags
                .filter(tag => tag.tag === 'param')
                .forEach(param => {
                  const { name, type, description = '' } = param;
                  appendixMd += `- \`${name}\`${type ? `: \`${type}\`` : ''} - ${description}\n\n`;
                });

              const returns = item.tags.filter(tag => tag.tag === 'returns');
              if (returns.length > 0) {
                appendixMd += `###${item.kind === 'method' ? '#' : ''} 返回值\n\n`;
                returns.forEach(item => {
                  const { name = '', type } = item;
                  appendixMd += `${type ? `\`${type}\` - ` : ''}${name}\n\n`;
                });
              }

              if (item.kind === 'function') appendixMd += `### 示例\n\n`;
            }
          });

          if (appendixMd.length > 0) {
            fs.appendFileSync(mapPath, appendixMd);
            console.log(`Appended file: ${mapPath}`);
          }
        }
      }
    }

  }
}

genDocs(fileTree);
