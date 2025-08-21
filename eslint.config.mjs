import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable unused variable checks
      "@typescript-eslint/no-unused-vars": "off",

      // Allow any type
      "@typescript-eslint/no-explicit-any": "off",

      // Allow @ts-nocheck comments
      "@typescript-eslint/ban-ts-comment": "off",

      // Disable React Hooks exhaustive deps warnings
      "react-hooks/exhaustive-deps": "off",

      // Disable React Hooks rules
      "react-hooks/rules-of-hooks": "off",

      // Allow img elements instead of Next.js Image
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
