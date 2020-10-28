module.exports = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig.json",
        "tsconfigRootDir": __dirname
    },
    "plugins": ["@typescript-eslint"],
    "rules": {
        "no-console": "error",
        "indent": ["error", 4],
    },
    "extends": [  
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ]
}