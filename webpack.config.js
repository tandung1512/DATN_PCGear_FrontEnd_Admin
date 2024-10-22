const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "crypto": require.resolve("crypto-browserify"), // Thêm dòng này
    },
  },
};
