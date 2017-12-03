# react-app-rewire-ts-jest

Add [Typescript](https://github.com/microsoft/typescript) testing with jest to a [`react-app-rewired`](https://github.com/timarney/react-app-rewired) config.

```js
/* config-overrides.js */

const rewireTsJest = require('react-app-rewire-ts-jest');

module.exports = {
  jest: function override(config) {
    // ...
    config = rewireTsJest(config);
    // ...
    return config;
  }
}
```

## NOTES
Version is the react-scripts version it was tested with.