# sx

Style props for building design systems with React.

## Installation

```sh
npm i @andideve/sx
```

## Usage

```jsx
import styled from '@emotion/styled';
import { system, createSfp } from '@andideve/sx';

// Create a new parser
const spacing = system({
  m: {
    property: 'margin',
    scale: 'space',
  },
  mx: {
    property: ['marginRight', 'marginLeft'],
    scale: 'space',
  },
  my: {
    property: ['marginTop', 'marginBottom'],
    scale: 'space',
  },
});

const shouldForwardProp = createSfp(spacing.propNames);

// Add parser to your styled component
const Box = styled('div', {
  shouldForwardProp,
})(spacing);

return (
  <>
    {/* result: 32px */}
    <Box mx={32} />
    {/* result: theme.space[2] */}
    <Box mx={2} />
  </>
);
```
