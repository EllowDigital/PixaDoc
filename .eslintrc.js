module.exports = {
  root: true,
  extends: ["universe/native", "universe/shared/typescript-analysis"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  ignorePatterns: ["node_modules/*", "dist/*", "build/*"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};
