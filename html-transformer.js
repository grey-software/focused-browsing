const fs = require('fs');

module.exports = {
  process(src, filename, config, options) {
    return {
      code: `module.exports = ${JSON.stringify(src)};`
    };
  },
};