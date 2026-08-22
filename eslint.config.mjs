import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: ["node_modules/**", "out/**", ".next/**", "tests/**", "scripts/**"],
  },
];

export default eslintConfig;
