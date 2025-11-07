import { RadixTree } from '../../src';

const sortWords = (a: { word: string }, b: { word: string }) => a.word.localeCompare(b.word);

describe('RadixTree (基数树)', () => {
  let tree: RadixTree;

  // 每次测试前都创建一个新的树实例
  beforeEach(() => {
    tree = new RadixTree();
  });

  describe('🧪 基础 Insert, Search, GetFrequency', () => {
    it('应能正确插入和搜索单个单词', () => {
      tree.insert('apple', 1);
      expect(tree.search('apple')).toBe(true);
      expect(tree.search('appl')).toBe(false);
      expect(tree.search('banana')).toBe(false);
    });

    it('应能正确处理词频', () => {
      tree.insert('apple', 2);
      expect(tree.getFrequency('apple')).toBe(2);
      tree.insert('apple', 3);
      expect(tree.getFrequency('apple')).toBe(5);
    });

    it('搜索不存在的单词时应返回 false', () => {
      tree.insert('apple', 1);
      expect(tree.search('banana')).toBe(false);
    });

    it('获取不存在单词的词频应为 0', () => {
      tree.insert('apple', 1);
      expect(tree.getFrequency('banana')).toBe(0);
    });
  });

  describe('🌳 节点分裂与分支逻辑 (Node Splitting and Branching)', () => {
    it('应正确处理节点分裂（先长后短）', () => {
      tree.insert('apple', 5);
      tree.insert('appl', 2); // 触发 "apple" 分裂为 "appl" 和 "e"

      expect(tree.search('apple')).toBe(true);
      expect(tree.getFrequency('apple')).toBe(5);

      expect(tree.search('appl')).toBe(true);
      expect(tree.getFrequency('appl')).toBe(2);
    });

    it('应正确处理节点分裂（先短后长）', () => {
      tree.insert('appl', 2);
      tree.insert('apple', 5); // 触发 "appl" 节点下增加 "e"

      expect(tree.search('appl')).toBe(true);
      expect(tree.getFrequency('appl')).toBe(2);

      expect(tree.search('apple')).toBe(true);
      expect(tree.getFrequency('apple')).toBe(5);
    });

    it('应正确处理节点分支', () => {
      tree.insert('apple', 5);
      tree.insert('apply', 3); // 触发 "apple" 分裂为 "appl" -> "e" 和 "y"

      expect(tree.search('apple')).toBe(true);
      expect(tree.getFrequency('apple')).toBe(5);

      expect(tree.search('apply')).toBe(true);
      expect(tree.getFrequency('apply')).toBe(3);

      // "appl" 只是一个路径节点，不是一个单词
      expect(tree.search('appl')).toBe(false);
      expect(tree.getFrequency('appl')).toBe(0);
    });
  });

  describe('🌏 多语言支持 (Multilingual Support)', () => {
    beforeEach(() => {
      tree.insert('你好', 2);
      tree.insert('你好世界', 5);
      tree.insert('hello', 1);
      tree.insert('hell', 3);
      tree.insert('🚀', 10);
      tree.insert('🚀✨', 4);
    });

    it('应能搜索中文单词', () => {
      expect(tree.search('你好')).toBe(true);
      expect(tree.getFrequency('你好')).toBe(2);
      expect(tree.search('你好世界')).toBe(true);
      expect(tree.getFrequency('你好世界')).toBe(5);
      expect(tree.search('你好吗')).toBe(false);
    });

    it('应能搜索 Emoji', () => {
      expect(tree.search('🚀')).toBe(true);
      expect(tree.getFrequency('🚀')).toBe(10);
      expect(tree.search('🚀✨')).toBe(true);
      expect(tree.getFrequency('🚀✨')).toBe(4);
      expect(tree.search('✨')).toBe(false);
    });

    it('应能正确处理混合前缀 (startsWith)', () => {
      expect(tree.startsWith('你好')).toBe(true);
      expect(tree.startsWith('你好世')).toBe(true);
      expect(tree.startsWith('你好吗')).toBe(false);
      expect(tree.startsWith('hel')).toBe(true);
      expect(tree.startsWith('🚀')).toBe(true);
      expect(tree.startsWith('')).toBe(true);
    });

    it('应能正确返回带前缀的单词 (getWordsWithPrefix)', () => {
      const resultCn = tree.getWordsWithPrefix('你好');
      expect(resultCn.sort(sortWords)).toEqual([
        { word: '你好', frequency: 2 },
        { word: '你好世界', frequency: 5 },
      ]);

      const resultEmoji = tree.getWordsWithPrefix('🚀');
      expect(resultEmoji.sort(sortWords)).toEqual([
        { word: '🚀', frequency: 10 },
        { word: '🚀✨', frequency: 4 },
      ]);

      const resultEn = tree.getWordsWithPrefix('hel');
      expect(resultEn.sort(sortWords)).toEqual([
        { word: 'hell', frequency: 3 },
        { word: 'hello', frequency: 1 },
      ]);
    });
  });

  describe('🔍 前缀搜索 (startsWith / getWordsWithPrefix)', () => {
    beforeEach(() => {
      tree.insert('test', 1);
      tree.insert('testing', 2);
      tree.insert('team', 3);
      tree.insert('teammate', 4);
    });

    it('startsWith 应能正确工作', () => {
      expect(tree.startsWith('t')).toBe(true);
      expect(tree.startsWith('te')).toBe(true);
      expect(tree.startsWith('test')).toBe(true);
      expect(tree.startsWith('testing')).toBe(true);
      expect(tree.startsWith('testosterone')).toBe(false);
      expect(tree.startsWith('team')).toBe(true);
      expect(tree.startsWith('z')).toBe(false);
    });

    it('getWordsWithPrefix 应返回所有匹配的单词', () => {
      const result = tree.getWordsWithPrefix('te');
      expect(result.sort(sortWords)).toEqual([
        { word: 'team', frequency: 3 },
        { word: 'teammate', frequency: 4 },
        { word: 'test', frequency: 1 },
        { word: 'testing', frequency: 2 },
      ]);
    });

    it('getWordsWithPrefix (精确匹配)', () => {
      const result = tree.getWordsWithPrefix('testing');
      expect(result).toEqual([{ word: 'testing', frequency: 2 }]);
    });

    it('getWordsWithPrefix (无匹配)', () => {
      const result = tree.getWordsWithPrefix('xyz');
      expect(result).toEqual([]);
    });

    it('getWordsWithPrefix (空前缀应返回所有单词)', () => {
      tree.insert('another', 1);
      const result = tree.getWordsWithPrefix('');
      expect(result.sort(sortWords)).toEqual([
        { word: 'another', frequency: 1 },
        { word: 'team', frequency: 3 },
        { word: 'teammate', frequency: 4 },
        { word: 'test', frequency: 1 },
        { word: 'testing', frequency: 2 },
      ]);
    });
  });

  describe('🗑️ 删除逻辑 (Delete)', () => {
    beforeEach(() => {
      tree.insert('test', 3);
      tree.insert('testing', 2);
      tree.insert('team', 4);
    });

    it('delete 应减少词频', () => {
      expect(tree.delete('test', 1)).toBe(true);
      expect(tree.search('test')).toBe(true);
      expect(tree.getFrequency('test')).toBe(2);
    });

    it('delete 词频到 0 时应移除单词', () => {
      expect(tree.delete('test', 3)).toBe(true);
      expect(tree.search('test')).toBe(false); // isEnd 变为 false
      expect(tree.getFrequency('test')).toBe(0);
    });

    it('deleteAll 应移除单词及其所有词频', () => {
      expect(tree.deleteAll('test')).toBe(true);
      expect(tree.search('test')).toBe(false);
      expect(tree.getFrequency('test')).toBe(0);
    });

    it('删除不存在的单词应返回 false', () => {
      expect(tree.delete('nonexistent')).toBe(false);
      expect(tree.deleteAll('nonexistent')).toBe(false);
    });

    it('删除次数超过词频应返回 false', () => {
      expect(tree.delete('team', 5)).toBe(false);
      expect(tree.search('team')).toBe(true);
      expect(tree.getFrequency('team')).toBe(4);
    });

    it('删除应能正确处理节点合并 (复杂情况)', () => {
      // 结构: root -> "te" -> "st", "am"
      expect(tree.search('test')).toBe(true);
      expect(tree.search('team')).toBe(true);
      expect(tree.startsWith('te')).toBe(true);

      // 删除 "team"
      expect(tree.deleteAll('team')).toBe(true);
      expect(tree.search('team')).toBe(false);

      // "te" 节点应与其唯一的子节点 "st" 合并
      // 树结构变为: root -> "test", "testing"
      // (注意: "test" 节点下还有 "ing" 子节点)

      expect(tree.search('test')).toBe(true); // 确保 "test" 仍然存在
      expect(tree.getFrequency('test')).toBe(3);
      expect(tree.search('testing')).toBe(true); // 确保 "testing" 仍然存在

      // 验证 "team" 路径确实消失
      expect(tree.startsWith('team')).toBe(false);

      // 验证 "test" 路径仍然完好
      expect(tree.startsWith('testi')).toBe(true);
    });
  });

  describe('🏁 边缘情况 (Edge Cases)', () => {
    it('应能正确处理空字符串 ""', () => {
      expect(tree.search('')).toBe(false); // 根节点默认不是单词

      tree.insert('', 3);
      expect(tree.search('')).toBe(true);
      expect(tree.getFrequency('')).toBe(3);

      tree.insert('apple', 1);

      const words = tree.getWordsWithPrefix('');
      expect(words.sort(sortWords)).toEqual([
        { word: '', frequency: 3 }, // 空字符串本身
        { word: 'apple', frequency: 1 },
      ]);

      expect(tree.delete('', 1)).toBe(true);
      expect(tree.getFrequency('')).toBe(2);

      expect(tree.deleteAll('')).toBe(true);
      expect(tree.search('')).toBe(false);
      expect(tree.getFrequency('')).toBe(0);
    });
  });

  describe('🔬 覆盖未命中的分支 (branch coverage)', () => {
    it('delete 应在字符串为某个 longer-word 的前缀时失败（deleteHelper 情况三）', () => {
      // 插入一个更长的词 'cart'
      tree.insert('cart', 1);

      // 尝试删除 'car' —— 它是 'cart' 的前缀，但不是完整词
      expect(tree.delete('car')).toBe(false);

      // 长词仍然存在
      expect(tree.search('cart')).toBe(true);
      expect(tree.getFrequency('cart')).toBe(1);
    });

    it('getFrequency 在查询为 longer-word 的前缀时应返回 0（getFrequencyHelper 情况三）', () => {
      tree.insert('cart', 2);
      // 'car' 不是独立单词，尽管它是 'cart' 的前缀
      expect(tree.getFrequency('car')).toBe(0);
    });

    it('getWordsWithPrefixHelper 部分匹配但互不包含时应返回空（情况三）', () => {
      // 插入单词 'cart' 和 'abc'
      tree.insert('cart', 1);
      tree.insert('abc', 1);

      // 查询一个与 'cart' 有部分公共前缀 'ca'，但 'cax' 与任何节点不完全包含
      expect(tree.getWordsWithPrefix('cax')).toEqual([]);

      // 另一个示例：'abc' vs 'ax'，公共前缀 'a'，但 'ax' 与 'abc' 互不包含
      expect(tree.getWordsWithPrefix('ax')).toEqual([]);
    });

    it('delete 在中间节点部分匹配但不完全时应返回 false（更深层次的情况）', () => {
      tree.insert('abxyz', 1);
      // 删除 'ab'（只是前缀，但对应路径节点并非单词） -> 删除失败
      expect(tree.delete('ab')).toBe(false);
      expect(tree.search('abxyz')).toBe(true);
    });

    it('getFrequency 在部分匹配（互不包含）场景应返回 0（更深层次）', () => {
      tree.insert('abxyz', 3);
      expect(tree.getFrequency('abp')).toBe(0);
    });

    it('delete 应能正确重置根节点的 isEnd', () => {
      tree.insert('', 2);
      expect(tree.search('')).toBe(true);
      expect(tree.delete('', 2)).toBe(true); // frequency 变为 0
      expect(tree.search('')).toBe(false);   // this.root.isEnd = false 被触发
      expect(tree.getFrequency('')).toBe(0);
    });

    it('delete 删除非完整单词路径应返回 false', () => {
      tree.insert('apple', 1);
      expect(tree.delete('app')).toBe(false); // "app" 只是前缀，不是单词
    });

    it('deleteAll 删除存在路径但非终止单词应返回 false', () => {
      tree.insert('apple', 1);
      expect(tree.deleteAll('app')).toBe(false); // "app" 存在路径但不是单词
    });
  });

});