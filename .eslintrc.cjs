module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: "standard",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        ".eslintrc.{js,cjs}",
      ],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "max-len": ["error", { "code": 120 }],
    "max-lines": ["error", { "max": 200 }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-unused-expressions": ["error", { "allowShortCircuit": true }],
    "max-lines-per-function": ["error", { "max": 30 }],
    "comma-dangle": ["error", "always-multiline"],
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
  },
};
