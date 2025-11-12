
# groupBy

## Function - groupBy

Group a collection by the given iteratee, supporting the following iteratee forms:

- Function `(item) => key`: Execute the function on each element, returning the grouping key.
- Numeric index: Group by element index in the array (elements with the same index will be grouped together).
- String path: Supports dot-separated paths for accessing deep object properties (e.g., "user.age").

When the iteratee is a string path, if an element has no value at that path (undefined or null), that element will be skipped and not included in any group.

Function signature (TypeScript):

```ts
function groupBy<T = any>(collection: T[] | undefined | null, iteratee: ((item: T) => any) | number | string): Record<string, T[]>
```

### Parameters

- collection: The collection to group, typically an array; if null or undefined, the function returns an empty object.
- iteratee: The rule for calculating the grouping key, which can be a function, numeric index, or dot-separated path string.

### Return Value

- Returns an object (Record<string, T[]>), where keys are grouping keys (converted to strings), and values are arrays of elements belonging to that group, with elements preserved as-is (references are not cloned).

### Examples

```ts
import { groupBy } from '../../src/array';

// Using a function as iteratee
const data = [{ id: 1, type: 'a' }, { id: 2, type: 'b' }, { id: 3, type: 'a' }];
const byType = groupBy(data, item => item.type);
// byType => { a: [{id:1,type:'a'},{id:3,type:'a'}], b: [{id:2,type:'b'}] }

// Using a numeric index as iteratee (group by element index)
const nums = ['zero', 'one', 'two'];
const byIndex = groupBy(nums, 0); // All elements grouped by the character at index 0

// Using a string path as iteratee (supports nested paths)
const users = [
	{ name: { first: 'foo' }, age: 20 },
	{ name: { first: 'bar' }, age: 21 },
	{ age: 22 }, // name is empty, will be skipped
];
const byFirstName = groupBy(users, 'name.first');
// byFirstName => { foo: [{...}], bar: [{...}] }
```

### Features
- If `collection` is empty (null/undefined/[]), returns an empty object {}.
- When iteratee is a string path and the path doesn't exist, or the path value is `null`/`undefined`, the corresponding element will be skipped.
- When iteratee is a number, elements are grouped by the value at the corresponding position (e.g., the Nth character of a string) or by index semantics; refer to the implementation to determine specific behavior.
- The function does not clone elements; elements in the returned arrays are original references (so circular references and object references are preserved).
- Keys are converted to strings as property names of the result object; if a function returns an object or Symbol, it will ultimately call toString (or convert to string) as the key name.

### Implementation Notes
- The implementation prioritizes checking the type of iteratee:
	- Function: Directly call to get the key.
	- Number: Access by index or calculate key by semantics defined in the implementation.
	- String: Supports dot-separated path access to deep properties (e.g., `a.b.c`).
- For path access, if any path segment is `undefined` or `null` during access, it is considered as having no value and that element is skipped.

