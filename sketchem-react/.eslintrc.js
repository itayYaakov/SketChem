module.exports = {
    env: {
        browser: true,
    },
    extends: ["plugin:react/recommended", "airbnb", "prettier"],
    // extends: ["plugin:react/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
        // "array-element-newline": ["error", { multiline: true, minItems: 3 }],
        "prettier/prettier": "error",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
