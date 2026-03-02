// Jest transform for .html files: exposes raw HTML as a module.exports string
// so test files can import page snapshots directly (used by popup.test.ts).
const fs = require('fs');

module.exports = {
  process(src, filename, config, options) {
    return {
      code: `module.exports = ${JSON.stringify(src)};`
    };
  },
};