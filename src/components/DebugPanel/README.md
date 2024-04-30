![Astro](https://img.shields.io/badge/astro-%232C2052.svg?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

# Debug CSS Astro Island

Aim to tweak any style propertie of any DOM element.

<ol>

<li>Add the DebugPanel component to the App component and add <i>data-debug="name"</i> to an element in the DOM

```tsx
import { DebugPanel } from "./components/DebugPanel";
...
<DebugPanel />;
<nav client::only="react" data-debug="navbar"></nav>
...
```

</li>
<li>Declare in entry.ts the related debug object and export it</li>

```typescript
interface DebugPanelProps {
  range: RangeProps[];
}

type RangeProps = {
  targetTag: string; // tag name of the element
  label: string; // label of the input
  min: string;
  max: string;
  value: string;
  step: string;
  unit?: "px" | "%" | "deg" | "em" | "rem";
  property: CSSProperty & string; // hyphenated css property to change (border-radius...)
};
/* Example */
const debug: DebugPanelProps = {
  range: [
    {
      targetTag: "navbar", // Add data-debug="navbar" to the element
      label: "Border Radius",
      min: "0",
      max: "100",
      value: "0",
      step: "1",
      unit: "px",
      property: "border-radius",
    },
  ],
};

export { debug };
```

</ol>
