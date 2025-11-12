# trie

## Class - Trie

Trie (Prefix Tree)

### Member Method - insert

Insert a word

#### Parameters

- `word`: `string` - The word to insert

### Member Method - search

Search for a word

#### Parameters

- `word`: `string` - The word to search for

#### Return Value

`boolean` - Whether the word exists

### Member Method - startsWith

Check if a prefix exists

#### Parameters

- `prefix`: `string` - The prefix

#### Return Value

`boolean` - Whether the prefix exists

### Member Method - getWordsWithPrefix

Get all words with the specified prefix

#### Parameters

- `prefix`: `string` - The prefix

#### Return Value

`string[]` - Array of words

### Member Method - delete

Delete a word (decrement frequency by 1)

#### Parameters

- `word`: `string` - The word to delete

#### Return Value

`boolean` - Whether deletion was successful



### Examples
```typescript
// Usage example
const trie = new Trie();

// Insert words
trie.insert("apple");
trie.insert("app");
trie.insert("application");
trie.insert("banana");
trie.insert("bat");
trie.insert("batch");
trie.insert("cat");

console.log("=== After inserting words ===");

// Search for words
console.log("Search 'apple':", trie.search("apple")); // true
console.log("Search 'app':", trie.search("app")); // true
console.log("Search 'appl':", trie.search("appl")); // false

// Check prefixes
console.log("Prefix 'app':", trie.startsWith("app")); // true
console.log("Prefix 'bat':", trie.startsWith("bat")); // true
console.log("Prefix 'dog':", trie.startsWith("dog")); // false

// Get all words with prefix
console.log("All words with prefix 'app':", trie.getWordsWithPrefix("app")); // ['app', 'apple', 'application']
console.log("All words with prefix 'ba':", trie.getWordsWithPrefix("ba")); // ['banana', 'bat', 'batch']
console.log("All words with prefix 'c':", trie.getWordsWithPrefix("c")); // ['cat']

console.log("\n=== Deletion operations ===");

// Delete words
console.log("Delete 'app':", trie.delete("app")); // true
console.log("Search 'app' after deletion:", trie.search("app")); // false
console.log("All words with prefix 'app' after deletion:", trie.getWordsWithPrefix("app")); // ['apple', 'application']

console.log("Delete 'banana':", trie.delete("banana")); // true
console.log("Search 'banana' after deletion:", trie.search("banana")); // false
console.log("All words with prefix 'ba' after deletion:", trie.getWordsWithPrefix("ba")); // ['bat', 'batch']

// Delete non-existent word
console.log("Delete non-existent 'dog':", trie.delete("dog")); // false

console.log("\n=== Final state ===");
console.log("All words starting with 'a':", trie.getWordsWithPrefix("a")); // ['apple', 'application']
console.log("All words starting with 'b':", trie.getWordsWithPrefix("b")); // ['bat', 'batch']
console.log("All words starting with 'c':", trie.getWordsWithPrefix("c")); // ['cat']
```

