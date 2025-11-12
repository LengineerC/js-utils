# format

## Function - format

Format a string using placeholders. Supports three placeholder forms: 
1. `{}`      : Automatically takes values in array order 
2. `{0}`, `{1}` : Numeric index (array) 
3. `{name}` : Object property

### Parameters

- `str`: `string` - The string to format

- `args`: `Record<string, any> | any[]` - Values to replace placeholders, array or object

### Return Value

`string` - The formatted string

### Examples

```typescript
format("Hello {}, {1}, {name}", [10, 20]); // Output: "Hello 10, 20, {name}" (object placeholder won't work because an array is passed)
```

