class TrieNode {
  public children: Map<string, TrieNode>;
  public isEnd: boolean;
  public frequency: number;

  public constructor() {
    this.children = new Map();
    this.isEnd = false;
    this.frequency = 0;
  }
}

/**
 * 字典树
 */
export class Trie {
  private root: TrieNode;

  public constructor() {
    this.root = new TrieNode();
  }

  private findNode(str: string): TrieNode | null {
    let node = this.root;

    for (const char of str) {
      const next = node.children.get(char);
      if (!next) return null;
      node = next;
    }

    return node;
  }

  /**
   * 插入一个单词并更新词频
   * @param {string} word 需要插入的单词
   */
  public insert(word: string) {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }

    node.isEnd = true;
    node.frequency += 1; // Increment frequency each time the word is inserted
  }

  /**
   * 查找是否存在单词
   * @param {string} word 需要查找的单词
   * @returns {boolean} 是否存在单词
   */
  public search(word: string): boolean {
    const node = this.findNode(word);
    return !!node && node.isEnd;
  }

  /**
   * 获取指定单词的频率
   * @param {string} word 需要查询频率的单词
   * @returns {number} 单词的频率
   */
  public getFrequency(word: string): number {
    const node = this.findNode(word);
    return node && node.isEnd ? node.frequency : 0;
  }

  /**
   * 判断是否存在前缀
   * @param {string} prefix 前缀
   * @returns {boolean} 是否存在前缀
   */
  public startsWith(prefix: string): boolean {
    return !!this.findNode(prefix);
  }

  /**
   * 获取指定前缀的所有单词
   * @param {string} prefix 前缀
   * @returns {string[]} 单词数组
   */
  public getWordsWithPrefix(prefix: string): string[] {
    const results: string[] = [];
    const node = this.findNode(prefix);

    if (!node) return results;

    const dfs = (curNode: TrieNode, path: string) => {
      if (curNode.isEnd) results.push(path);

      for (const [ch, next] of curNode.children) {
        dfs(next, path + ch);
      }
    };

    dfs(node, prefix);
    return results;
  }

  /**
   * 删除一个单词（词频-1）
   * @param {string} word 需要删除的单词
   * @returns {boolean} 是否删除成功
   */
  public delete(word: string): boolean {
    const stack: [TrieNode, string][] = [];
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) return false;
      stack.push([node, char]);
      node = node.children.get(char)!;
    }

    if (!node.isEnd) return false;

    node.frequency -= 1;
    if (node.frequency === 0) {
      node.isEnd = false;
    }

    for (let i = stack.length - 1; i >= 0; i--) {
      const [parent, char] = stack[i];
      const child = parent.children.get(char)!;

      if (child.children.size === 0 && !child.isEnd) {
        parent.children.delete(char);
      } else {
        break;
      }
    }

    return true;
  }

}
