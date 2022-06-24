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
    // !!! temp
    ignorePatterns: [
        "build/*",
        "public/*",
        "local/*",
        "src/features/counter/*",
        "src/features/to/",
        "src/_actions/user.action.ts",
    ],
    plugins: ["react", "@typescript-eslint", "prettier", "simple-import-sort"],
    rules: {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "arrow-parens": "off",
        "no-console": "off",
        "import/prefer-default-export": "off",
        "no-underscore-dangle": "off",
        "class-methods-use-this": "off",
        "no-param-reassign": ["error", { props: true, ignorePropertyModificationsFor: ["state"] }],
        // "array-element-newline": ["error", { multiline: true, minItems: 3 }],
        "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
        "prettier/prettier": "error",
        "no-unused-vars": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        "react/no-unused-prop-types": "warn",
        "prefer-const": "warn", //! !! can be enable when deploying
        "react/jsx-props-no-spreading": "off", //! !! can be enable when deploying
    },
    overrides: [
        {
            files: ["**/index.ts"],
            rules: {
                "import/export": "off",
            },
        },
    ],
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
