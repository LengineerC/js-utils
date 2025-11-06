# RadixTree

## 类 - RadixTree

基数树（Radix Tree）

支持多语言（中文、日文、emoji 等）、词频统计、节点合并与删除操作。

---

### 成员方法 - insert

插入一个单词及其词频。

#### 参数

* `word`: `string` - 要插入的单词，可以为空字符串。
* `count`: `number` *(可选，默认值为 1)* - 单词的词频增量。

#### 返回值

`void`

---

### 成员方法 - search

查找是否存在完整单词。

#### 参数

* `word`: `string` - 需要查找的单词。

#### 返回值

`boolean` - 是否存在完整单词。

---

### 成员方法 - startsWith

判断是否存在以指定前缀开头的单词。

#### 参数

* `prefix`: `string` - 前缀字符串。

#### 返回值

`boolean` - 是否存在以该前缀开头的单词。

---

### 成员方法 - getWordsWithPrefix

获取指定前缀开头的所有单词及其词频。

#### 参数

* `prefix`: `string` - 前缀字符串，可为空字符串以获取所有单词。

#### 返回值

`{ word: string, frequency: number }[]` - 单词与词频数组。

---

### 成员方法 - getFrequency

获取指定单词的当前词频。

#### 参数

* `word`: `string` - 需要查询的单词。

#### 返回值

`number` - 单词的词频（若不存在则为 0）。

---

### 成员方法 - delete

删除指定单词的部分词频或整个单词。

#### 参数

* `word`: `string` - 需要删除的单词。
* `count`: `number` *(可选，默认值为 1)* - 要删除的词频次数。

#### 返回值

`boolean` - 是否成功删除。若单词不存在或词频不足，返回 `false`。

---

### 成员方法 - deleteAll

彻底删除指定单词及其所有词频。

#### 参数

* `word`: `string` - 需要删除的完整单词。

#### 返回值

`boolean` - 是否成功删除。

---

### 示例

```typescript
// 使用示例
import { RadixTree } from './RadixTree';

const tree = new RadixTree();

// 插入单词及词频
tree.insert("apple", 3);
tree.insert("app", 1);
tree.insert("banana", 2);
tree.insert("bat");
tree.insert("batch");
tree.insert("你好");
tree.insert("你好吗");
tree.insert("こんにちは");
tree.insert("こんばんは");
tree.insert("😀");
tree.insert("😀😀");

// === 搜索与前缀匹配 ===
console.log("搜索 'apple':", tree.search("apple")); // true
console.log("搜索 'app':", tree.search("app")); // true
console.log("搜索 'appl':", tree.search("appl")); // false

console.log("前缀 'app':", tree.startsWith("app")); // true
console.log("前缀 'ba':", tree.startsWith("ba")); // true
console.log("前缀 'dog':", tree.startsWith("dog")); // false

// === 获取前缀相关单词 ===
console.log("前缀 'app' 的单词:", tree.getWordsWithPrefix("app"));
// => [{ word: "app", frequency: 1 }, { word: "apple", frequency: 3 }]

console.log("前缀 '你' 的单词:", tree.getWordsWithPrefix("你"));
// => [{ word: "你好", frequency: 1 }, { word: "你好吗", frequency: 1 }]

console.log("前缀 '😀' 的单词:", tree.getWordsWithPrefix("😀"));
// => [{ word: "😀", frequency: 1 }, { word: "😀😀", frequency: 1 }]

// === 词频与删除 ===
console.log("单词 'apple' 词频:", tree.getFrequency("apple")); // 3
tree.delete("apple", 1);
console.log("删除一次后 'apple' 词频:", tree.getFrequency("apple")); // 2

console.log("删除 'banana':", tree.deleteAll("banana")); // true
console.log("搜索 'banana':", tree.search("banana")); // false

// === 边界测试 ===
tree.insert("");
console.log("空字符串搜索:", tree.search("")); // true
tree.delete("");
console.log("空字符串删除后:", tree.getFrequency("")); // 0
```