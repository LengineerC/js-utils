# debounce

## Function - debounce

Debounce function

### Parameters

- `fn`: `(...args: any[]) => any` - The function to debounce

- `delay`: `number` - Delay time (ms), default 300ms

- `immediate`: `boolean` - Whether to execute immediately

### Examples
```typescript
import { debounce } from '@lengineerc/utils';

// Basic usage
const search = debounce((query: string) => {
  console.log('Search:', query);
}, 300);

search('a'); // Won't execute immediately
search('ab'); // Cancel previous, restart timer
search('abc'); // Cancel previous, restart timer
// After 300ms: Search: abc

// Immediate execution mode
const save = debounce((data: any) => {
  console.log('Save:', data);
}, 500, true);

save({ id: 1 }); // Execute immediately: Save: { id: 1 }
save({ id: 2 }); // Won't execute, wait 500ms
// After 500ms can execute immediately again
```

## Function - Debounce

Debounce function decorator (for methods, called via @ decorator syntax)

### Parameters

- `delay`: `number` - Delay time (ms), default 300ms

- `immediate`: `boolean` - Whether to execute immediately

### Examples

```typescript
import { Debounce } from '@lengineerc/utils';

class SearchComponent {
  @Debounce(300)
  onSearch(query: string) {
    console.log('Search:', query);
  }

  @Debounce(500, true)
  onSave(data: any) {
    console.log('Save:', data);
  }
}

const search = new SearchComponent();
search.onSearch('test'); // Execute after 300ms
search.onSave({ id: 1 }); // Execute immediately
```

