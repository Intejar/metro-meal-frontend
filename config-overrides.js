const { override } = require("customize-cra");

module.exports = override((config) => {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    os: require.resolve("os-browserify/browser"),
    https: require.resolve("https-browserify"),
    http: require.resolve("stream-http"),
    constants: require.resolve("constants-browserify"),
    crypto: require.resolve("crypto-browserify"),
    querystring: require.resolve("querystring-es3"),
    vm: require.resolve("vm-browserify"),
    zlib: require.resolve("browserify-zlib"),
    process: require.resolve("process/browser"),
    tty: require.resolve("tty-browserify"),
    fs: false, // Explicitly set fs to false since it's not used in the browser
    child_process: false,
    worker_threads: false,
    module: false,
    path: require.resolve("path-browserify"), // Add path-browserify
    stream: require.resolve("stream-browserify"), // Add stream-browserify
  };

  // Add loader for declaration files if needed
  config.module.rules.push({
    test: /\.d\.ts$/,
    use: "raw-loader",
  });

  return config;
});
