# trie

## 类 - Trie

字典树

### 成员方法 - insert

插入一个单词

#### 参数

- `word`: `string` - 需要插入的单词

### 成员方法 - search

查找是否存在单词

#### 参数

- `word`: `string` - 需要查找的单词

#### 返回值

`boolean` - 是否存在单词

### 成员方法 - startsWith

判断是否存在前缀

#### 参数

- `prefix`: `string` - 前缀

#### 返回值

`boolean` - 是否存在前缀

### 成员方法 - getWordsWithPrefix

获取指定前缀的所有单词

#### 参数

- `prefix`: `string` - 前缀

#### 返回值

`string[]` - 单词数组

### 成员方法 - delete

删除一个单词（词频-1）

#### 参数

- `word`: `string` - 需要删除的单词

#### 返回值

`boolean` - 是否删除成功



### 示例
```typescript
// 使用示例
const trie = new Trie();

// 插入单词
trie.insert("apple");
trie.insert("app");
trie.insert("application");
trie.insert("banana");
trie.insert("bat");
trie.insert("batch");
trie.insert("cat");

console.log("=== 插入单词后 ===");

// 搜索单词
console.log("搜索 'apple':", trie.search("apple")); // true
console.log("搜索 'app':", trie.search("app")); // true
console.log("搜索 'appl':", trie.search("appl")); // false

// 检查前缀
console.log("前缀 'app':", trie.startsWith("app")); // true
console.log("前缀 'bat':", trie.startsWith("bat")); // true
console.log("前缀 'dog':", trie.startsWith("dog")); // false

// 获取前缀相关的所有单词
console.log("前缀 'app' 的所有单词:", trie.getWordsWithPrefix("app")); // ['app', 'apple', 'application']
console.log("前缀 'ba' 的所有单词:", trie.getWordsWithPrefix("ba")); // ['banana', 'bat', 'batch']
console.log("前缀 'c' 的所有单词:", trie.getWordsWithPrefix("c")); // ['cat']

console.log("\n=== 删除操作 ===");

// 删除单词
console.log("删除 'app':", trie.delete("app")); // true
console.log("删除后搜索 'app':", trie.search("app")); // false
console.log("删除后前缀 'app' 的所有单词:", trie.getWordsWithPrefix("app")); // ['apple', 'application']

console.log("删除 'banana':", trie.delete("banana")); // true
console.log("删除后搜索 'banana':", trie.search("banana")); // false
console.log("删除后前缀 'ba' 的所有单词:", trie.getWordsWithPrefix("ba")); // ['bat', 'batch']

// 删除不存在的单词
console.log("删除不存在的 'dog':", trie.delete("dog")); // false

console.log("\n=== 最终状态 ===");
console.log("所有 'a' 开头的单词:", trie.getWordsWithPrefix("a")); // ['apple', 'application']
console.log("所有 'b' 开头的单词:", trie.getWordsWithPrefix("b")); // ['bat', 'batch']
console.log("所有 'c' 开头的单词:", trie.getWordsWithPrefix("c")); // ['cat']
```