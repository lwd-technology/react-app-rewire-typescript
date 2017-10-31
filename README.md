# react-app-rewire-typescript

Add [Typescript](https://github.com/microsoft/typescript) Webpack loading to a [`react-app-rewired`](https://github.com/timarney/react-app-rewired) config.

```js
const rewireTypescript = require('react-app-rewire-typescript')

// Add Typescript support
config = rewireTypescript(config, env)
```

For running `.ts` test files, take a look at [`ts-jest`](https://github.com/kulshekhar/ts-jest). PRs to integrate `ts-jest` compatibility into this repo are welcome.
