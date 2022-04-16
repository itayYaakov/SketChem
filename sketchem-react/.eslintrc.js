module.exports = {
    env: {
        browser: true,
    },
    extends: ["plugin:react/recommended", "airbnb", "airbnb-typescript", "prettier"],
    // extends: ["plugin:react/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
        "arrow-parens": "off",
        "no-console": "off",
        "import/prefer-default-export": "off",
        // "array-element-newline": ["error", { multiline: true, minItems: 3 }],
        "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
        "prettier/prettier": "error",
        "no-unused-vars": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        "react/no-unused-prop-types": "warn",
        "react/jsx-props-no-spreading": "off", //!!! can be enable when deploying
    },
    settings: {
        react: {
            version: "detect",
        },
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
            typescript: {
                // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
                alwaysTryTypes: true,
                // use <root>/path/to/folder/tsconfig.json
                project: "./tsconfig.json",
            },
        },
    },
};
