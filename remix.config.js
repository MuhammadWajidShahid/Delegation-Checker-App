/** @type {import('@remix-run/dev').AppConfig} */


module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{ts,tsx}"],
  serverModuleFormat: "cjs",
  browserNodeBuiltinsPolyfill: {
    modules: {
      crypto: true,
      events: true,
      string_decoder: true,
      stream: true,
      buffer: true,
    },
  },
};

