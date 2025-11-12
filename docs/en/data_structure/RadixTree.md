# RadixTree

## Class - RadixTree

Radix Tree

Supports multiple languages (Chinese, Japanese, emoji, etc.), word frequency statistics, node merging and deletion operations.

---

### Member Method - insert

Insert a word and its frequency.

#### Parameters

* `word`: `string` - The word to insert, can be an empty string.
* `count`: `number` *(optional, default value is 1)* - The word frequency increment.

#### Return Value

`void`

---

### Member Method - search

Search for a complete word.

#### Parameters

* `word`: `string` - The word to search for.

#### Return Value

`boolean` - Whether the complete word exists.

---

### Member Method - startsWith

Check if there are words starting with the specified prefix.

#### Parameters

* `prefix`: `string` - The prefix string.

#### Return Value

`boolean` - Whether there are words starting with this prefix.

---

### Member Method - getWordsWithPrefix

Get all words starting with the specified prefix and their frequencies.

#### Parameters

* `prefix`: `string` - The prefix string, can be an empty string to get all words.

#### Return Value

`{ word: string, frequency: number }[]` - Array of words and frequencies.

---

### Member Method - getFrequency

Get the current frequency of a specified word.

#### Parameters

* `word`: `string` - The word to query.

#### Return Value

`number` - The word frequency (0 if it doesn't exist).

---

### Member Method - delete

Delete part of the frequency or the entire word.

#### Parameters

* `word`: `string` - The word to delete.
* `count`: `number` *(optional, default value is 1)* - The number of frequency counts to delete.

#### Return Value

`boolean` - Whether deletion was successful. Returns `false` if the word doesn't exist or frequency is insufficient.

---

### Member Method - deleteAll

Completely delete a specified word and all its frequencies.

#### Parameters

* `word`: `string` - The complete word to delete.

#### Return Value

`boolean` - Whether deletion was successful.

---

### Examples

```typescript
// Usage example
import { RadixTree } from './RadixTree';

const tree = new RadixTree();

// Insert words and frequencies
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

// === Search and prefix matching ===
console.log("Search 'apple':", tree.search("apple")); // true
console.log("Search 'app':", tree.search("app")); // true
console.log("Search 'appl':", tree.search("appl")); // false

console.log("Prefix 'app':", tree.startsWith("app")); // true
console.log("Prefix 'ba':", tree.startsWith("ba")); // true
console.log("Prefix 'dog':", tree.startsWith("dog")); // false

// === Get words with prefix ===
console.log("Words with prefix 'app':", tree.getWordsWithPrefix("app"));
// => [{ word: "app", frequency: 1 }, { word: "apple", frequency: 3 }]

console.log("Words with prefix '你':", tree.getWordsWithPrefix("你"));
// => [{ word: "你好", frequency: 1 }, { word: "你好吗", frequency: 1 }]

console.log("Words with prefix '😀':", tree.getWordsWithPrefix("😀"));
// => [{ word: "😀", frequency: 1 }, { word: "😀😀", frequency: 1 }]

// === Frequency and deletion ===
console.log("Frequency of 'apple':", tree.getFrequency("apple")); // 3
tree.delete("apple", 1);
console.log("Frequency of 'apple' after one deletion:", tree.getFrequency("apple")); // 2

console.log("Delete 'banana':", tree.deleteAll("banana")); // true
console.log("Search 'banana':", tree.search("banana")); // false

// === Edge case testing ===
tree.insert("");
console.log("Search empty string:", tree.search("")); // true
tree.delete("");
console.log("Frequency of empty string after deletion:", tree.getFrequency("")); // 0
```

