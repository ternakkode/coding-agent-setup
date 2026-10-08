import { defineConfig } from "oxlint";

// A syntactic convention: start each collection transformation in a new visual block.
const collectionTransformation = {
  selector:
    "VariableDeclaration:has(VariableDeclarator > CallExpression > MemberExpression[computed=false][property.name=/^(map|filter|flatMap|reduce|sort|toSorted)$/])",
};

const schemaDeclaration = {
  selector:
    "VariableDeclaration:has(VariableDeclarator > CallExpression > MemberExpression[computed=false][property.name=/^(pipe|strictObject|object|array|union|picklist)$/])",
};
const parseDeclaration = {
  selector:
    "VariableDeclaration:has(VariableDeclarator > CallExpression > MemberExpression[computed=false][property.name=safeParse])",
};
const parseFailureGuard = {
  selector:
    "IfStatement[test.type=UnaryExpression][test.operator='!'][test.argument.type=MemberExpression][test.argument.property.name=success][consequent.type=ThrowStatement]",
};

export default defineConfig({
  plugins: [],
  categories: { correctness: "off" },
  options: { respectEslintDisableDirectives: false },
  ignorePatterns: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/coverage/**"],
  jsPlugins: [
    { name: "coding-agent-style", specifier: "@stylistic/eslint-plugin" },
    { name: "coding-agent", specifier: "./contracts.ts" },
  ],
  overrides: [
    {
      files: ["**/*.{ts,tsx,mts,cts}"],
      plugins: ["typescript"],
      rules: {
        "typescript/no-explicit-any": "error",
        "coding-agent/no-unknown": "error",
        "coding-agent/named-function-contracts": "error",
        "coding-agent/explicit-export-return": "error",
        "coding-agent/named-domain-values": "error",
      },
    },
    {
      files: ["**/boundaries/**/*.{ts,tsx,mts,cts}", "**/*.boundary.{ts,tsx,mts,cts}"],
      rules: { "coding-agent/no-unknown": "off" },
    },
  ],
  rules: {
    "eslint/complexity": ["error", { max: 12 }],
    "eslint/max-depth": ["error", { max: 4 }],
    "eslint/max-lines-per-function": [
      "error",
      { max: 100, skipBlankLines: true, skipComments: true },
    ],
    "coding-agent-style/padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "import", next: "*" },
      { blankLine: "any", prev: "import", next: "import" },
      { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
      { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
      {
        blankLine: "always",
        prev: "*",
        next: ["return", "if", "for", "while", "do", "switch", "try"],
      },
      { blankLine: "always", prev: "block-like", next: "*" },
      { blankLine: "always", prev: "if", next: "*" },
      { blankLine: "always", prev: "*", next: collectionTransformation },
      { blankLine: "always", prev: schemaDeclaration, next: schemaDeclaration },
      { blankLine: "never", prev: parseDeclaration, next: parseFailureGuard },
    ],
    "coding-agent-style/no-trailing-spaces": "error",
    "coding-agent-style/no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],
    "coding-agent-style/eol-last": ["error", "always"],
  },
});
