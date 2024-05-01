![Astro](https://img.shields.io/badge/astro-%232C2052.svg?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

# Debug CSS Astro Island

<p>Aim to tweak any style propertie of any DOM element.</p>
<p>3 types of inputs available : </p>
<ul>
  <li>Range</li>
  <li>Checkbox</li>
  <li>Radio</li>
</ul>

## How to use

<ol>

<li>Add the AstroDebugPanel component your component tree and add <i>data-debug="name"</i> to an element in the DOM

```tsx
import { AstroDebugPanel } from "./components/DebugPanel";
...
<body>
<AstroDebugPanel />;
<nav data-debug="navbar">...</nav>
<main>...</main>
</body>
...
```

</li>
<li>Declare in entry.ts the related debug object and export it</li>

```typescript
interface DebugPanelProps {
  range?: RangeProps[];
  checkbox?: CheckboxProps[];
  radio?: RadioProps[];
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

type CheckboxProps = {
  targetTag: string;
  label: string;
  property: CSSProperty & string;
  value: string;
  isChecked: boolean;
};

type RadioProps = {
  targetTag: string;
  label: string;
  property: CSSProperty & string;
  options: {
    label: string;
    value: string;
    checked?: boolean;
  }[];
  unit?: Unit;
};

/*
 *Example
 */
export const debug: DebugPanelProps = {
  range: [
    {
      targetTag: "navbar", // Add data-debug="navbar" to the element targeted
      label: "Border Radius",
      min: "0",
      max: "100",
      value: "0",
      step: "1",
      unit: "px",
      property: "border-radius",
    },
    {
      ...
    }
  ],
  radio : [
    {
      targetTag: "navbar",
      label: "Border Style",
      property: "border-style",
      options: [
        {
          label: "Solid",
          value: "solid",
          checked: true,
        },
        {
          label: "Dashed",
          value: "dashed",
        },
        {
          label: "Dotted",
          value: "dotted",
        },
      ],
    },
    {
      ...
    }
  ],
  checkbox: [
    {
      targetTag: "navbar",
      label: "Border",
      property: "border",
      value: "1px solid black",
      isChecked: true,
    },
    {
      ...
    }
  ],
};

```

</ol>
