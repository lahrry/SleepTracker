module.exports = {
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios).+" // Add exceptions for ES module libraries
    ],
  };