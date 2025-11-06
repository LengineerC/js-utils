import { Trie } from '../../src';

describe('Trie 字典树', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie();
  });

  test('插入与搜索基础功能', () => {
    trie.insert('apple');
    trie.insert('app');
    trie.insert('banana');

    expect(trie.search('apple')).toBe(true);
    expect(trie.search('app')).toBe(true);
    expect(trie.search('banana')).toBe(true);

    expect(trie.search('apples')).toBe(false);
    expect(trie.search('ban')).toBe(false);
    expect(trie.startsWith('app')).toBe(true);
    expect(trie.startsWith('ban')).toBe(true);
    expect(trie.startsWith('cat')).toBe(false);
  });

  test('getWordsWithPrefix 能正确返回匹配单词', () => {
    trie.insert('app');
    trie.insert('apple');
    trie.insert('apply');
    trie.insert('ape');
    trie.insert('bat');
    trie.insert('batch');

    const words = trie.getWordsWithPrefix('app');
    expect(words.sort()).toEqual(['app', 'apple', 'apply']);
  });

  test('删除单词后能正确更新', () => {
    trie.insert('apple');
    trie.insert('app');
    trie.insert('application');

    expect(trie.search('apple')).toBe(true);
    expect(trie.delete('apple')).toBe(true);
    expect(trie.search('apple')).toBe(false);
    expect(trie.search('app')).toBe(true);
    expect(trie.search('application')).toBe(true);

    // 删除不存在的单词
    expect(trie.delete('nonexistent')).toBe(false);
  });

  test('多语言支持 - 中文', () => {
    trie.insert('你好');
    trie.insert('您好');
    trie.insert('你好吗');
    trie.insert('天气');

    expect(trie.search('你好')).toBe(true);
    expect(trie.search('您好')).toBe(true);
    expect(trie.search('你')).toBe(false);
    expect(trie.startsWith('你')).toBe(true);
    expect(trie.getWordsWithPrefix('你').sort()).toEqual(['你好', '你好吗']);
  });

  test('多语言支持 - 日文', () => {
    trie.insert('こんにちは');
    trie.insert('こんばんは');
    trie.insert('おはよう');

    expect(trie.search('こんにちは')).toBe(true);
    expect(trie.startsWith('こん')).toBe(true);
    expect(trie.getWordsWithPrefix('こ')).toEqual(['こんにちは', 'こんばんは']);
  });

  test('多语言支持 - emoji', () => {
    trie.insert('😀');
    trie.insert('😀😃');
    trie.insert('😂');
    trie.insert('❤️');
    trie.insert('🥺👉👈');

    expect(trie.search('😀')).toBe(true);
    expect(trie.search('😀😃')).toBe(true);
    expect(trie.search('🥺👉👈')).toBe(true);
    expect(trie.startsWith('😀')).toBe(true);

    const prefixResults = trie.getWordsWithPrefix('😀');
    expect(prefixResults.sort()).toEqual(['😀', '😀😃']);
  });

  test('边界情况', () => {
    // 空字符串
    trie.insert('');
    expect(trie.search('')).toBe(true);

    // 删除空字符串
    expect(trie.delete('')).toBe(true);
    expect(trie.search('')).toBe(false);

    // 重复插入
    trie.insert('repeat');
    trie.insert('repeat');
    expect(trie.search('repeat')).toBe(true);

    // 删除后再插入
    trie.delete('repeat');
    expect(trie.search('repeat')).toBe(false);
    trie.insert('repeat');
    expect(trie.search('repeat')).toBe(true);
  });

  test('复杂前缀匹配', () => {
    const words = [
      'abc',
      'abcd',
      'abcde',
      'abce',
      'xyz',
      'xyzz',
    ];
    words.forEach(w => trie.insert(w));

    expect(trie.getWordsWithPrefix('abc').sort()).toEqual(['abc', 'abcd', 'abcde', 'abce']);
    expect(trie.getWordsWithPrefix('xyz').sort()).toEqual(['xyz', 'xyzz']);
    expect(trie.getWordsWithPrefix('nope')).toEqual([]);
  });
});
