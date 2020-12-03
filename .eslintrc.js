module.exports = {
    "root": true,
    "env": {
        "node": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "padded-blocks": "off",
        "max-len": [
        "error",
        130,
        2,
        {
            "ignoreUrls": true,
            "ignoreComments": false,
            "ignoreRegExpLiterals": true,
            "ignoreStrings": true,
            "ignoreTemplateLiterals": true
        }
        ],
        "key-spacing": [
            "warn",
            {
              "beforeColon": false,
              "afterColon": true
            }
        ],
        "lines-around-directive": [
            "warn",
            {
              "before": "always",
              "after": "always"
            }
        ],
        "no-return-await": "warn",
        "rest-spread-spacing": ["warn", "never"],
        "no-param-reassign": ["error", { "props": false }],
        "arrow-body-style": "off",
        "prefer-destructuring": [
            "warn",
            {
              "VariableDeclarator": {
                "array": false,
                "object": true
              },
              "AssignmentExpression": {
                "array": true,
                "object": true
              }
            },
            {
              "enforceForRenamedProperties": false
            }
        ],
        "no-multiple-empty-lines": [
            "warn",
            {
              "max": 2,
              "maxEOF": 0
            }
        ],
        "no-trailing-spaces": [
            "warn",
            {
              "skipBlankLines": false,
              "ignoreComments": false
            }
        ],
        "comma-spacing": [
            "warn",
            {
              "before": false,
              "after": true
            }
        ],
        "spaced-comment": [
            "warn",
            "always",
            {
              "line": {
                "exceptions": ["-", "+"],
                "markers": ["=", "!"]
              },
              "block": {
                "exceptions": ["-", "+"],
                "markers": ["=", "!"],
                "balanced": true
              }
            }
        ]
    }
};
