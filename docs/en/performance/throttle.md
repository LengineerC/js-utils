# throttle

## Function - throttle

Throttle function

### Parameters

- `fn`: `(...args: any[]) => any` - The function to throttle

- `delay`: `number` - Delay time (ms), default 300ms

### Examples
```typescript
import { throttle } from '@lengineerc/utils';

// Basic usage
const scrollHandler = throttle((event: Event) => {
  console.log('Scroll event:', event);
}, 100);

window.addEventListener('scroll', scrollHandler);
// Will only execute once within 100ms

// Button click throttling
const buttonClick = throttle(() => {
  console.log('Button clicked');
}, 1000);

document.getElementById('button')?.addEventListener('click', buttonClick);
// Can only click once per second

// Input field throttling
const inputHandler = throttle((value: string) => {
  console.log('Input value:', value);
}, 300);

document.getElementById('input')?.addEventListener('input', (e) => {
  inputHandler((e.target as HTMLInputElement).value);
});
```

## Function - Throttle

Throttle decorator (for methods, called via @ decorator syntax)

### Parameters

- `delay`: `number` - Delay time (ms), default 300ms

### Examples
```typescript
import { Throttle } from '@lengineerc/utils';

class ScrollComponent {
  @Throttle(100)
  onScroll(event: Event) {
    console.log('Scroll handling:', event);
  }

  @Throttle(1000)
  onButtonClick() {
    console.log('Button click handling');
  }
}

const component = new ScrollComponent();

// When scrolling quickly, will only execute once within 100ms
window.addEventListener('scroll', component.onScroll.bind(component));

// When clicking quickly, will only execute once per second
document.getElementById('button')?.addEventListener('click', component.onButtonClick.bind(component));
```

