# react-app-rewire-typescript

Add [Typescript](https://github.com/microsoft/typescript) Webpack loading to a [`react-app-rewired`](https://github.com/timarney/react-app-rewired) config.

```js
/* config-overrides.js */

const rewireTypescript = require('react-app-rewire-typescript');

module.exports = function override(config, env) {
    // ...
    config = rewireTypescript(config, env);
    // ...
    return config;
}
```

For running `.ts` test files, take a look at [`ts-jest`](https://github.com/kulshekhar/ts-jest). PRs to integrate `ts-jest` compatibility into this repo are welcome.
