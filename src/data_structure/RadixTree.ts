interface WordFrequency {
  word: string;
  frequency: number;
}

class RadixTreeNode {
  word: string;
  isEnd: boolean;
  frequency: number;
  children: Set<RadixTreeNode>;

  constructor(word: string = '', isEnd: boolean = false, frequency: number = 0) {
    this.word = word;
    this.isEnd = isEnd;
    this.frequency = frequency;
    this.children = new Set<RadixTreeNode>();
  }
}

/**
 * 基数树（支持词频和多语言），实现源自CSDN
 * @see {@link https://blog.csdn.net/qq_35423154/article/details/130119383|CSDN}
 */
export class RadixTree {
  private root: RadixTreeNode;

  public constructor() {
    this.root = new RadixTreeNode();
  }

  /**
   * 向字典树中插入一个单词及其词频。
   * 
   * @param {string} str 要插入的字符串，可以为空字符串。
   * @param {number} [count=1] 该单词的词频增量（默认为 1）。
   */
  public insert(str: string, count: number = 1): void {
    if (str === '') {
      this.root.isEnd = true;
      this.root.frequency += count;
      return;
    }
    this.insertHelper(str, this.root, count);
  }

  private insertHelper(str: string, node: RadixTreeNode, count: number): void {
    // 如果当前没有子节点，则直接作为新的子节点
    if (node.children.size === 0) {
      const newNode = new RadixTreeNode(str, true, count);
      node.children.add(newNode);
      return;
    }

    let isMatch = false;
    for (const current of node.children) {
      let i = 0;
      // 计算公共前缀长度
      for (; i < str.length && i < current.word.length; i++) {
        if (str[i] !== current.word[i]) {
          break;
        }
      }

      if (i !== 0) {
        isMatch = true;

        // 情况一：当前节点的内容与字符串完全匹配
        if (i === str.length && i === current.word.length) {
          current.isEnd = true;
          current.frequency += count;
        }
        // 
        // *** 修正点: 节点分裂逻辑 ***
        // 
        // 情况二：需要分裂节点
        else if (i !== current.word.length) {
          // 1. 保存当前节点（如 "apple"）的原始状态
          const oldIsEnd = current.isEnd;
          const oldFrequency = current.frequency;
          const oldChildren = new Set(current.children);

          // 2. 创建新子节点，包含 "apple" 的剩余部分 ("e")
          const newNode = new RadixTreeNode(
            current.word.substring(i), // "e"
            oldIsEnd,                 // "apple" 的 isEnd
            oldFrequency             // "apple" 的 frequency
          );
          newNode.children = oldChildren;

          // 3. 更新当前节点为分裂点 ("appl")
          current.word = current.word.substring(0, i);
          current.children.clear();
          current.children.add(newNode);

          // 4. 根据新插入的 str ("appl" 或 "apply") 更新 "appl" 节点的状态
          if (i === str.length) {
            // 插入的是 "appl"，"appl" 节点是单词结尾
            current.isEnd = true;
            current.frequency = count; // "appl" 的词频是 count
          } else {
            // 插入的是 "apply"，"appl" 只是一个路径节点
            current.isEnd = false;
            current.frequency = 0;
            // 5. 创建 "apply" 的剩余部分 ("y")
            const newNode2 = new RadixTreeNode(str.substring(i), true, count);
            current.children.add(newNode2);
          }
        }
        // 情况三：当前节点已匹配完，继续往子节点匹配
        else {
          this.insertHelper(str.substring(i), current, count);
        }

        if (isMatch) {
          return;
        }
      }
    }

    // 如果没有找到匹配的前缀，则直接插入新节点
    if (!isMatch) {
      const newNode = new RadixTreeNode(str, true, count);
      node.children.add(newNode);
    }
  }

  /**
   * 删除单词的部分词频或整个单词。
   * 
   * - 如果 `count` 小于词频，则仅减少频率。
   * - 如果 `count` 等于词频，则彻底删除该单词。
   * - 若单词不存在或频率不足，则返回 false。
   * 
   * @param {string} str 要删除的单词。
   * @param {number} [count=1] 要删除的次数。
   * @returns {boolean} 是否成功删除。
   */
  public delete(str: string, count: number = 1): boolean {
    if (str === '') {
      if (this.root.isEnd && this.root.frequency >= count) {
        this.root.frequency -= count;
        if (this.root.frequency === 0) {
          this.root.isEnd = false;
        }
        return true;
      }
      return false;
    }
    return this.deleteHelper(str, this.root, count) !== null;
  }

  /**
   * 删除指定单词的所有词频。
   * 
   * - 如果该单词存在，将完全删除。
   * - 如果不存在或只是路径节点（非单词），返回 false。
   * 
   * @param {string} str 要彻底删除的单词。
   * @returns {boolean} 是否成功删除。
   */
  public deleteAll(str: string): boolean {
    if (str === '') {
      if (this.root.isEnd) {
        this.root.isEnd = false;
        this.root.frequency = 0;
        return true;
      }
      return false;
    }

    const frequency = this.getFrequency(str);
    if (frequency > 0) {
      return this.delete(str, frequency);
    }
    return false;
  }

  private deleteHelper(str: string, node: RadixTreeNode, count: number): RadixTreeNode | null {
    let isMatch = false;
    let nodeToRemove: RadixTreeNode | null = null;

    for (const current of node.children) {
      let i = 0;
      // 计算公共前缀长度
      for (; i < str.length && i < current.word.length; i++) {
        if (str[i] !== current.word[i]) {
          break;
        }
      }

      if (i !== 0) {
        isMatch = true;

        // 情况一：当前节点的内容与字符串完全匹配
        if (i === str.length && i === current.word.length) {
          if (!current.isEnd || current.frequency < count) {
            return null; // 删除失败
          }

          current.frequency -= count;
          if (current.frequency === 0) {
            current.isEnd = false;
          }

          // 如果该节点没有子节点且不是结尾，则将该节点删除
          if (current.children.size === 0 && !current.isEnd) {
            nodeToRemove = current;
          }
        }
        // 情况二：当前节点是字符串的前缀
        else if (i === current.word.length) {
          const result = this.deleteHelper(str.substring(i), current, count);
          if (result === null) {
            return null; // 删除失败
          }
        }
        // 情况三：字符串是当前节点的前缀，此时必定删除失败
        else {
          return null;
        }

        break;
      }
    }

    if (!isMatch) {
      return null; // 未找到要删除的字符串
    }

    // 删除标记的节点
    if (nodeToRemove) {
      node.children.delete(nodeToRemove);
    }

    // 如果删除后父节点仅剩下一个子节点，且父节点不是完整单词，则合并节点
    if (node.children.size === 1 && !node.isEnd && node !== this.root) {
      const subNode = Array.from(node.children)[0];
      node.children.delete(subNode);
      node.isEnd = subNode.isEnd;
      node.frequency = subNode.frequency;
      node.word += subNode.word;
      node.children = new Set(subNode.children);
      return node;
    }

    return node;
  }

  public search(str: string): boolean {
    if (str === '') {
      return this.root.isEnd;
    }
    return this.searchHelper(str, this.root);
  }

  private searchHelper(str: string, node: RadixTreeNode): boolean {
    for (const current of node.children) {
      let i = 0;
      // 计算公共前缀长度
      for (; i < str.length && i < current.word.length; i++) {
        if (str[i] !== current.word[i]) {
          break;
        }
      }

      if (i !== 0) {
        // 情况一：当前节点的内容与字符串完全匹配
        if (i === str.length && i === current.word.length) {
          return current.isEnd;
        }
        // 情况二：当前节点的内容是字符串的前缀
        else if (i === current.word.length) {
          return this.searchHelper(str.substring(i), current);
        }
        // 情况三：字符串的内容是当前节点的前缀，直接返回false
        else {
          return false;
        }
      }
    }
    // 没有找到
    return false;
  }

  /**
   * 获取某个单词的词频。
   * 
   * - 如果单词存在，返回其累计词频。
   * - 如果不存在或仅为路径节点，返回 0。
   * 
   * @param {string} str 要查询的单词。
   * @returns {number} 该单词的词频（可能为 0）。
   */
  public getFrequency(str: string): number {
    if (str === '') {
      return this.root.isEnd ? this.root.frequency : 0;
    }
    return this.getFrequencyHelper(str, this.root);
  }

  private getFrequencyHelper(str: string, node: RadixTreeNode): number {
    for (const current of node.children) {
      let i = 0;
      // 计算公共前缀长度
      for (; i < str.length && i < current.word.length; i++) {
        if (str[i] !== current.word[i]) {
          break;
        }
      }

      if (i !== 0) {
        // 情况一：当前节点的内容与字符串完全匹配
        if (i === str.length && i === current.word.length) {
          return current.isEnd ? current.frequency : 0;
        }
        // 情况二：当前节点的内容是字符串的前缀
        else if (i === current.word.length) {
          return this.getFrequencyHelper(str.substring(i), current);
        }
        // 情况三：字符串的内容是当前节点的前缀，没有完全匹配
        else {
          return 0;
        }
      }
    }
    return 0;
  }

  /**
   * 判断是否存在指定前缀开头的单词。
   * 
   * @param {string} prefix 前缀字符串。
   * @returns {boolean} 若存在以该前缀开头的单词，则返回 true。
   */
  public startsWith(prefix: string): boolean {
    if (prefix === '') {
      return true;
    }
    return this.startsWithHelper(prefix, this.root);
  }

  private startsWithHelper(prefix: string, node: RadixTreeNode): boolean {
    for (const current of node.children) {
      let i = 0;
      // 计算公共前缀长度
      for (; i < prefix.length && i < current.word.length; i++) {
        if (prefix[i] !== current.word[i]) {
          break;
        }
      }

      if (i !== 0) {
        // 情况一：前缀完全匹配了当前节点
        if (i === prefix.length) {
          return true;
        }
        // 情况二：当前节点完全匹配了前缀的一部分
        else if (i === current.word.length) {
          return this.startsWithHelper(prefix.substring(i), current);
        }
        // 情况三：部分匹配但都没有完全包含对方
        else {
          return false;
        }
      }
    }
    return false;
  }

  /**
   * 获取以指定前缀开头的所有单词及其词频。
   * 
   * - 如果前缀为空字符串，则返回所有单词。
   * - 若前缀不存在，则返回空数组。
   * 
   * @param {string} prefix 前缀字符串，可为空。
   * @returns {{word: string, frequency: number}[]} 匹配的单词及频率数组。
   */
  public getWordsWithPrefix(prefix: string): WordFrequency[] {
    const result: WordFrequency[] = [];

    if (prefix === '') {
      // 如果前缀为空，返回所有单词
      this.collectAllWords(this.root, '', result);
      return result;
    }

    this.getWordsWithPrefixHelper(prefix, this.root, "", result);
    return result;
  }

  private getWordsWithPrefixHelper(prefix: string, node: RadixTreeNode, accumulatedPrefix: string, result: WordFrequency[]): void {
    for (const current of node.children) {
      let i = 0;
      // 计算公共前缀长度
      for (; i < prefix.length && i < current.word.length; i++) {
        if (prefix[i] !== current.word[i]) {
          break;
        }
      }

      if (i !== 0) {
        // 情况一：前缀完全匹配了当前节点
        if (i === prefix.length) {
          this.collectAllWords(current, accumulatedPrefix, result);
          return;
        }
        // 情况二：当前节点完全匹配了前缀的一部分
        else if (i === current.word.length) {
          this.getWordsWithPrefixHelper(
            prefix.substring(i),
            current,
            accumulatedPrefix + current.word,
            result
          );
          return;
        }
        // 情况三：部分匹配但都没有完全包含对方
        else {
          return;
        }
      }
    }
  }

  private collectAllWords(node: RadixTreeNode, currentWord: string, result: WordFrequency[]): void {
    const fullWord = currentWord + node.word;

    if (node.isEnd) {
      result.push({
        word: fullWord,
        frequency: node.frequency
      });
    }

    for (const child of node.children) {
      this.collectAllWords(child, fullWord, result);
    }
  }
}
