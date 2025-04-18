import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  ignores: ["eslint.config.js"],
  extends: [
    ...tseslint.configs.recommendedTypeChecked, // Or use strictTypeChecked for stricter rules
    ...tseslint.configs.stylisticTypeChecked, // Optional for stylistic rules
    "plugin:prettier/recommended"
  ],
  plugins: {
    "react-x": reactX,
    "react-dom": reactDom,
    "react-hooks": reactHooks, // If you want to include react-hooks plugin rules
    "react-refresh": reactRefresh, // If you're using React Fast Refresh
  },
  rules: {
    // Enable React-specific rules for TypeScript
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules, // React Hooks rules
    ...reactRefresh.configs.recommended.rules, // React Refresh rules if needed
  },
  languageOptions: {
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
