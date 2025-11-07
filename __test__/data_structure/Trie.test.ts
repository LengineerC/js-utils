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

  test('词频 - 插入时词频正确增加', () => {
    trie.insert('apple');
    trie.insert('apple');
    trie.insert('banana');

    // apple 的频率应该是 2，banana 的频率应该是 1
    expect(trie.getFrequency('apple')).toBe(2);
    expect(trie.getFrequency('banana')).toBe(1);
    expect(trie.getFrequency('app')).toBe(0); // app 不存在
  });

  test('getWordsWithPrefix 能正确返回匹配单词', () => {
    trie.insert('app');
    trie.insert('apple');
    trie.insert('apply');
    trie.insert('ape');
    trie.insert('bat');
    trie.insert('batch');

    const words = trie.getWordsWithPrefix('app');
    expect(words.sort()).toEqual([{
      "frequency": 1,
      "word": "app",
    },
    {
      "frequency": 1,
      "word": "apple",
    },
    {
      "frequency": 1,
      "word": "apply",
    },]);
  });

  test('删除单词后能正确更新词频', () => {
    trie.insert('apple');
    trie.insert('apple');
    trie.insert('app');
    trie.insert('banana');

    // apple 插入了两次，频率应该是 2
    expect(trie.getFrequency('apple')).toBe(2);

    // 删除 apple 后，频率应该减少到 1
    expect(trie.delete('apple')).toBe(true);
    expect(trie.getFrequency('apple')).toBe(1);

    // 删除一次，频率变为 0，搜索时应该为 false
    expect(trie.delete('apple')).toBe(true);
    expect(trie.getFrequency('apple')).toBe(0);
    expect(trie.search('apple')).toBe(false);

    // 删除不存在的单词
    expect(trie.delete('nonexistent')).toBe(false);
  });

  test('删除时节点合并与词频减少', () => {
    trie.insert('apple');
    trie.insert('apple');
    trie.insert('app');
    trie.insert('banana');

    // 插入后，apple 的频率为 2
    expect(trie.getFrequency('apple')).toBe(2);

    // 删除 apple 后，频率应为 1
    expect(trie.delete('apple')).toBe(true);
    expect(trie.getFrequency('apple')).toBe(1);

    // 删除 app 后，频率为 0，删除 app 时会合并节点
    expect(trie.delete('app')).toBe(true);
    expect(trie.getFrequency('apple')).toBe(1);
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
    expect(trie.getWordsWithPrefix('你').sort()).toEqual([
      {
        "frequency": 1,
        "word": "你好",
      },
      {
        "frequency": 1,
        "word": "你好吗",
      },
    ]);
  });

  test('多语言支持 - 日文', () => {
    trie.insert('こんにちは');
    trie.insert('こんばんは');
    trie.insert('おはよう');

    expect(trie.search('こんにちは')).toBe(true);
    expect(trie.startsWith('こん')).toBe(true);
    expect(trie.getWordsWithPrefix('こ')).toEqual([
      {
        "frequency": 1,
        "word": "こんにちは",
      },
      {
        "frequency": 1,
        "word": "こんばんは",
      },
    ]);
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
    expect(prefixResults.sort()).toEqual([{ word: '😀', frequency: 1 }, { "word": '😀😃', frequency: 1 }]);
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

    expect(trie.getFrequency('repeat')).toBe(2);
    expect(trie.search('repeat')).toBe(true);

    // 第一次删除
    trie.delete('repeat');
    expect(trie.getFrequency('repeat')).toBe(1);
    expect(trie.search('repeat')).toBe(true); // 单词仍然存在！

    // 第二次删除
    trie.delete('repeat');
    expect(trie.getFrequency('repeat')).toBe(0);
    expect(trie.search('repeat')).toBe(false); // 单词现在才被移除！
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

    expect(trie.getWordsWithPrefix('abc').sort()).toEqual([
      {
        "frequency": 1,
        "word": "abc",
      },
      {
        "frequency": 1,
        "word": "abcd",
      },
      {
        "frequency": 1,
        "word": "abcde",
      },
      {
        "frequency": 1,
        "word": "abce",
      },
    ]);
    expect(trie.getWordsWithPrefix('xyz').sort()).toEqual([
      {
        "frequency": 1,
        "word": "xyz",
      },
      {
        "frequency": 1,
        "word": "xyzz",
      }
    ]);
    expect(trie.getWordsWithPrefix('nope')).toEqual([]);
  });
});
