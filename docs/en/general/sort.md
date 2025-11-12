# sort

## Function - compareVersion

Version number comparison, can be directly used to compare two versions, or can be called via Array.prototype.sort to sort version numbers from small to large, supports 1.0.0 and pre-release version tags connected with - such as 1.0.0-alpha

### Parameters

- `a`: `string` - Version a

- `b`: `string` - Version b

### Return Value

`number` - 0 for equal, 1: a>b, -1: b<a

### Examples

```typescript
import { compareVersion } from '@lengineerc/utils';

// Basic version comparison
console.log(compareVersion('1.0.0', '1.0.1')); // -1
console.log(compareVersion('1.0.1', '1.0.0')); // 1
console.log(compareVersion('1.0.0', '1.0.0')); // 0

// Different length versions
console.log(compareVersion('1.0', '1.0.0')); // 0
console.log(compareVersion('1.0.0', '1.0')); // 0

// Pre-release versions
console.log(compareVersion('1.0.0', '1.0.0-alpha')); // 1
console.log(compareVersion('1.0.0-alpha', '1.0.0')); // -1
console.log(compareVersion('1.0.0-alpha', '1.0.0-beta')); // -1

// Used for array sorting
const versions = ['1.0.0', '2.0.0', '1.0.0-alpha', '1.0.1', '1.0.0-beta'];
versions.sort(compareVersion);
console.log(versions); // ['1.0.0-alpha', '1.0.0-beta', '1.0.0', '1.0.1', '2.0.0']
```

## Supported Version Formats

- Standard semantic versions: `1.0.0`, `2.1.3`
- Pre-release versions: `1.0.0-alpha`, `1.0.0-beta.1`, `1.0.0-rc.1`
- Different length versions: `1.0`, `1.0.0`, `1.0.0.0`

## Comparison Rules

1. Compare digit parts level by level (major version, minor version, patch version)
2. Missing version parts are treated as 0
3. Release versions are greater than pre-release versions
4. Pre-release versions are compared alphabetically

