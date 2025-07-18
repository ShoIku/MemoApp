import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js"
 

console.log("✅ ESLint config loaded")

export default [
  {
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  // rules ここから -----------------------
  {
    rules: {
      "react/react-in-jsx-scope": 0,
      "semi": [2, "never"],
      "comma-dangle": [2, "never"]
    }
  }
  // rules ここまで -----------------------
]
