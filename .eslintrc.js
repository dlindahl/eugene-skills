module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jest": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "standard",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "import"
  ],
  "rules": {
    "array-callback-return": "error",
    "arrow-body-style": "error",
    "arrow-parens": "error",
    "arrow-spacing": "error",
    "capitalized-comments": "warn",
    "computed-property-spacing": "warn",
    "consistent-return": "warn",
    "curly": "warn",
    "default-case": "error",
    "dot-location": "error",
    "dot-notation": "warn",
    "func-names": "error",
    "func-style": [
      "warn",
      "declaration",
      {
        "allowArrowFunctions": true
      }
    ],
    "generator-star-spacing": "error",
    "import/no-dynamic-require": "error",
    "import/no-internal-modules": [
      "error",
      {
        "allow": [
          "**/src/**/*",
          "model/*"
        ]
      }
    ],
    "import/no-webpack-loader-syntax": "error",
    "import/first": "warn",
    "import/newline-after-import": "warn",
    "import/order": [
      "warn",
      {
        "groups": [
          // Treat all module types equally in regards to order
          [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index"
          ]
        ]
      }
    ],
    "import/no-unassigned-import": "warn",
    "import/no-named-default": "warn",
    "linebreak-style": [
      "error",
      "unix"
    ],
    "max-len": [
      "warn",
      {
        "code": 120,
        "comments": 120
      }
    ],
    "max-params": "warn",
    "newline-per-chained-call": "warn",
    "no-alert": "error",
    "no-confusing-arrow": "error",
    "no-console": [
      "warn",
      {
        "allow": [
          "error",
          "info",
          "warn"
        ]
      }
    ],
    "no-delete-var": "error",
    "no-duplicate-imports": "error",
    "no-else-return": "error",
    "no-empty-function": "error",
    "no-lonely-if": "error",
    "no-magic-numbers": [
      "error",
      {
        "enforceConst": true,
        "ignoreArrayIndexes": true
      }
    ],
    "no-negated-condition": "error",
    "no-path-concat": "error",
    "no-process-env": "warn",
    "no-return-assign": "warn",
    "no-shadow": "error",
    "no-ternary": "warn",
    "no-useless-computed-key": "error",
    "no-useless-concat": "warn",
    "no-useless-constructor": "error",
    "no-useless-rename": "error",
    "no-useless-return": "warn",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-const": "error",
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",
    "quote-props": [
      "warn",
      "as-needed"
    ],
    "rest-spread-spacing": "error",
    "sort-imports": "off", // TODO: Enable (with pull request)
    "sort-keys": "error",
    "sort-vars": "error",
    "spaced-comment": "error",
    "template-curly-spacing": "error"
  }
};
